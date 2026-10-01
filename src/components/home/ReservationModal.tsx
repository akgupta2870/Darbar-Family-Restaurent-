import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Crown, Sparkles, CheckCircle2, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import { TableReservation } from '../../types';
import { useOrder } from '../../context/OrderContext';
import { NotificationService } from '../../services/notificationService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { restaurantSettings, showToast } = useOrder();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    guestsCount: 4,
    date: 'Today, Oct 1',
    timeSlot: '8:00 PM - Dinner',
    seatingArea: 'Private Family Booth' as TableReservation['seatingArea'],
    specialOccasion: 'Family Get-Together' as NonNullable<TableReservation['specialOccasion']>,
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      showToast('Missing details', 'Please enter your name and phone number', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await FirebaseService.createTableReservation({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || `${formData.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        guestsCount: Number(formData.guestsCount),
        date: formData.date,
        timeSlot: formData.timeSlot,
        seatingArea: formData.seatingArea,
        specialOccasion: formData.specialOccasion,
        specialRequests: formData.specialRequests,
      });

      setConfirmedReservation(res);
      showToast(
        'Table Reserved!',
        `Confirmed for ${formData.guestsCount} guests at Darbar. SMS confirmation sent!`,
        'success'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 p-6 border-b border-amber-200 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200 shadow-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                <span>Darbar Fine Dining</span>
                <span className="w-1 h-1 rounded-full bg-amber-600" />
                <span>Family Cabins</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Reserve a Family Table
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            "अच्छा खाना... बेहतर माहौल... यहीं है दरबार" — Reserve AC private family cabins, grand dining hall seats, or celebration tables.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {confirmedReservation ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Reservation Confirmed
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                  Table Confirmed for {confirmedReservation.customerName}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  We look forward to hosting your family at Darbar!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-2 text-xs text-stone-800">
                <div className="flex justify-between py-1 border-b border-amber-200/60">
                  <span className="text-stone-500 font-medium">Assigned Space:</span>
                  <span className="font-bold text-amber-900">{confirmedReservation.tableAssigned} ({confirmedReservation.seatingArea})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/60">
                  <span className="text-stone-500 font-medium">Date & Time:</span>
                  <span className="font-bold">{confirmedReservation.date} · {confirmedReservation.timeSlot}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/60">
                  <span className="text-stone-500 font-medium">Guests Count:</span>
                  <span className="font-bold">{confirmedReservation.guestsCount} Guests</span>
                </div>
                {confirmedReservation.specialOccasion && confirmedReservation.specialOccasion !== 'None' && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 font-medium">Occasion:</span>
                    <span className="font-bold text-amber-800">{confirmedReservation.specialOccasion} Celebration</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-500">
                A confirmation SMS & WhatsApp message has been scheduled to <span className="font-semibold text-stone-800">{confirmedReservation.phone}</span>.
              </p>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Done
                </button>
                <a
                  href={NotificationService.generateWhatsAppOrderUrl(
                    restaurantSettings.whatsappNumber,
                    undefined,
                    `Hi Darbar! I just reserved table #${confirmedReservation.id} for ${confirmedReservation.guestsCount} guests.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  WhatsApp Restaurant
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Rajesh Kapoor"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Guests & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    >
                      <option value={2}>2 Guests (Couples)</option>
                      <option value={4}>4 Guests (Small Family)</option>
                      <option value={6}>6 Guests (Family Table)</option>
                      <option value={8}>8 Guests (Large Family Booth)</option>
                      <option value={12}>12+ Guests (Party / Celebration)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Seating Preference
                  </label>
                  <select
                    value={formData.seatingArea}
                    onChange={(e) => setFormData({ ...formData, seatingArea: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    <option value="Private Family Booth">AC Private Family Cabin</option>
                    <option value="Main Royal Dining Hall">Main Royal Dining Hall</option>
                    <option value="First Floor Balcony View">First Floor Balcony View</option>
                    <option value="Cafe & Student Lounge">Cafe & Student Lounge</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Reservation Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    >
                      <option value="Today, Oct 1">Today (Oct 1)</option>
                      <option value="Tomorrow, Oct 2">Tomorrow (Oct 2)</option>
                      <option value="Friday Evening">Friday Evening</option>
                      <option value="Saturday Weekend">Saturday Weekend</option>
                      <option value="Sunday Family Feast">Sunday Family Feast</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    >
                      <option value="1:00 PM - Family Lunch">1:00 PM - Family Lunch</option>
                      <option value="2:00 PM - Afternoon Lunch">2:00 PM - Afternoon Lunch</option>
                      <option value="7:30 PM - Early Dinner">7:30 PM - Early Dinner</option>
                      <option value="8:15 PM - Prime Dinner">8:15 PM - Prime Dinner</option>
                      <option value="9:00 PM - Late Dinner">9:00 PM - Late Dinner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Occasion & Requests */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Special Occasion
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Family Get-Together', 'Birthday', 'Anniversary', 'None'] as const).map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setFormData({ ...formData, specialOccasion: occ })}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        formData.specialOccasion === occ
                          ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Special Notes / Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Need toddler high-chair, quiet corner, flower bouquet, or less spicy family banquet preparation..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isSubmitting ? 'Confirming with Darbar...' : 'Confirm Family Table Reservation'}</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant confirmation · No advance booking fee required</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Phone, Sparkles, CheckCircle2, XCircle, Search, Plus, Filter, Crown } from 'lucide-react';
import { TableReservation } from '../../types';
import { FirebaseService } from '../../services/firebaseService';
import { useOrder } from '../../context/OrderContext';

export const AdminReservations: React.FC = () => {
  const { showToast } = useOrder();
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled'>('All');
  const [isLoading, setIsLoading] = useState(true);

  // New manual walk-in / phone modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRes, setNewRes] = useState({
    customerName: '',
    phone: '',
    guestsCount: 4,
    date: 'Today, Oct 1',
    timeSlot: '8:00 PM - Dinner',
    seatingArea: 'Private Family Booth' as TableReservation['seatingArea'],
    specialOccasion: 'Family Get-Together' as NonNullable<TableReservation['specialOccasion']>,
    specialRequests: '',
  });

  const loadReservations = async () => {
    setIsLoading(true);
    const data = await FirebaseService.getTableReservations();
    setReservations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: TableReservation['status']) => {
    await FirebaseService.updateReservationStatus(id, newStatus);
    showToast('Reservation Updated', `Status changed to ${newStatus}`, 'success');
    loadReservations();
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.customerName || !newRes.phone) return;
    await FirebaseService.createTableReservation({
      customerName: newRes.customerName,
      phone: newRes.phone,
      email: `${newRes.customerName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
      guestsCount: Number(newRes.guestsCount),
      date: newRes.date,
      timeSlot: newRes.timeSlot,
      seatingArea: newRes.seatingArea,
      specialOccasion: newRes.specialOccasion,
      specialRequests: newRes.specialRequests,
    });
    showToast('Booking Created', `Table assigned for ${newRes.customerName}`, 'success');
    setShowAddModal(false);
    loadReservations();
  };

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      (r.tableAssigned && r.tableAssigned.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Table & Private Cabin Reservations
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage fine dining family seating, private cabins, and celebrations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by guest name, phone, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table / Cards */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Guest & Contact</th>
                <th className="py-3 px-4">Guests & Space</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Occasion & Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No reservations found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 text-sm">
                        {res.customerName}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{res.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-700" />
                        <span>{res.guestsCount} Guests</span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                        {res.tableAssigned ? `📍 ${res.tableAssigned}` : res.seatingArea}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {res.seatingArea}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">
                        {res.date}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{res.timeSlot}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {res.specialOccasion && res.specialOccasion !== 'None' ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 mb-1 border border-amber-300">
                          🎉 {res.specialOccasion}
                        </span>
                      ) : null}
                      <p className="text-[11px] text-stone-500 truncate" title={res.specialRequests || 'No special requests'}>
                        {res.specialRequests || 'Standard dining'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          res.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : res.status === 'Seated'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : res.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'Seated')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Seat Table
                          </button>
                        )}
                        {res.status === 'Seated' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Completed
                          </button>
                        )}
                        {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange(res.id, 'Cancelled')}
                            className="px-2 py-1 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-[11px] transition-colors cursor-pointer"
                            title="Cancel reservation"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Book Walk-in / Phone Reservation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={newRes.customerName}
                  onChange={(e) => setNewRes({ ...newRes, customerName: e.target.value })}
                  placeholder="e.g. Smt. Gupta"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newRes.phone}
                  onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Guests</label>
                  <select
                    value={newRes.guestsCount}
                    onChange={(e) => setNewRes({ ...newRes, guestsCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value={2}>2 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={6}>6 Guests</option>
                    <option value={8}>8 Guests</option>
                    <option value={12}>12+ Guests</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Seating Area</label>
                  <select
                    value={newRes.seatingArea}
                    onChange={(e) => setNewRes({ ...newRes, seatingArea: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="Private Family Booth">AC Private Family Cabin</option>
                    <option value="Main Royal Dining Hall">Main Royal Dining Hall</option>
                    <option value="First Floor Balcony View">First Floor Balcony</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date</label>
                  <select
                    value={newRes.date}
                    onChange={(e) => setNewRes({ ...newRes, date: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="Today, Oct 1">Today</option>
                    <option value="Tomorrow, Oct 2">Tomorrow</option>
                    <option value="Weekend Evening">Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time</label>
                  <select
                    value={newRes.timeSlot}
                    onChange={(e) => setNewRes({ ...newRes, timeSlot: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="1:30 PM - Lunch">1:30 PM - Lunch</option>
                    <option value="8:00 PM - Dinner">8:00 PM - Dinner</option>
                    <option value="9:00 PM - Dinner">9:00 PM - Dinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Occasion / Notes</label>
                <input
                  type="text"
                  value={newRes.specialRequests}
                  onChange={(e) => setNewRes({ ...newRes, specialRequests: e.target.value })}
                  placeholder="e.g. Birthday celebration, high chair"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

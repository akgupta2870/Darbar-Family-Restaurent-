import React, { useState } from 'react';
import { Tag, Plus, Edit2, Check, X, Sparkles } from 'lucide-react';
import { Offer } from '../../types';
import { FirebaseService } from '../../services/firebaseService';
import { useOrder } from '../../context/OrderContext';

interface AdminOffersProps {
  offers: Offer[];
  onRefreshOffers: () => void;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({ offers, onRefreshOffers }) => {
  const { showToast } = useOrder();
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<Offer>>({
    code: '',
    title: '',
    description: '',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 499,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    badge: 'Special Deal',
  });

  const handleOpenAdd = () => {
    setFormData({
      code: 'FEAST100',
      title: 'Flat ₹100 OFF above ₹499',
      description: 'Exclusive discount on North Indian curries and biryanis.',
      discountType: 'flat',
      discountValue: 100,
      minOrder: 499,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
      badge: 'Promotion',
    });
    setIsAddingNew(true);
    setEditingOffer(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title) return;

    const offerToSave: Offer = {
      id: editingOffer ? editingOffer.id : `offer-${Date.now()}`,
      code: formData.code.toUpperCase(),
      title: formData.title,
      description: formData.description || '',
      discountType: formData.discountType as 'percentage' | 'flat',
      discountValue: Number(formData.discountValue) || 50,
      minOrder: Number(formData.minOrder) || 299,
      startDate: formData.startDate || '2026-01-01',
      endDate: formData.endDate || '2026-12-31',
      isActive: formData.isActive !== false,
      badge: formData.badge || 'Promo',
    };

    await FirebaseService.saveOffer(offerToSave);
    showToast('Offer Saved', `Coupon ${offerToSave.code} configured successfully`, 'success');
    setIsAddingNew(false);
    setEditingOffer(null);
    onRefreshOffers();
  };

  const handleToggleActive = async (offer: Offer) => {
    const updated = { ...offer, isActive: !offer.isActive };
    await FirebaseService.saveOffer(updated);
    showToast('Offer Updated', `${offer.code} is now ${updated.isActive ? 'active' : 'inactive'}`, 'info');
    onRefreshOffers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Promotional Offers & Discounts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure coupons and customer marketing banners to boost repeat ordering.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-5 rounded-2xl bg-[#141722] border transition-all flex flex-col justify-between ${
              offer.isActive ? 'border-[#262c3b] hover:border-amber-500/40' : 'border-[#1f232d] opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-[#1d212d] border border-dashed border-amber-500/40 text-amber-300 font-mono font-bold text-xs tracking-wider">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleToggleActive(offer)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    offer.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{offer.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{offer.description}</p>
            </div>

            <div className="pt-3 border-t border-[#202534] flex items-center justify-between text-xs">
              <div className="text-slate-400">
                <span>Min Order: </span>
                <span className="font-mono text-white font-semibold">₹{offer.minOrder}</span>
                <span className="mx-1">·</span>
                <span>{offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF</span>
              </div>

              <button
                onClick={() => {
                  setEditingOffer(offer);
                  setFormData({ ...offer });
                  setIsAddingNew(false);
                }}
                className="p-1 hover:bg-[#202532] rounded text-slate-400 hover:text-white"
                title="Edit offer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingOffer) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141722] border border-[#282f40] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#222736]">
              <h3 className="text-base font-serif font-bold text-white">
                {isAddingNew ? 'Create New Promotional Offer' : `Edit Offer "${editingOffer?.code}"`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingOffer(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ZAIKA50"
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Weekend Deal"
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Flat ₹100 OFF on Orders Above ₹499"
                  className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'flat' | 'percentage' })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue || ''}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Minimum Order Value (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.minOrder || ''}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Customer Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#222736] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingOffer(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#202534] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

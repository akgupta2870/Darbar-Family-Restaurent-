import React, { useState } from 'react';
import { Settings, Save, Sparkles, Rocket, ShieldCheck, MapPin, Phone, MessageCircle, Clock, Truck } from 'lucide-react';
import { RestaurantSettings } from '../../types';
import { useOrder } from '../../context/OrderContext';

export const AdminSettings: React.FC = () => {
  const { restaurantSettings, updateSettings } = useOrder();
  const [formData, setFormData] = useState<RestaurantSettings>({ ...restaurantSettings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const phase2Features = [
    { title: 'Live GPS Delivery Tracking', desc: 'Real-time rider location on interactive map with dynamic ETA calculation.' },
    { title: 'Delivery Partner Management', desc: 'Dedicated delivery boy mobile app, automated dispatch & commission settlement.' },
    { title: 'Loyalty Points & Rewards Program', desc: 'Points per ₹100 spent, redeemable on subsequent dining and deliveries.' },
    { title: 'Automated WhatsApp Bot Ordering', desc: 'Full automated chatbot taking orders directly inside WhatsApp without web navigation.' },
    { title: 'Kitchen Display System (KDS)', desc: 'Tablet app for chefs in kitchen with order timer and itemized recipe steps.' },
    { title: 'Real-Time Inventory & Ingredient Tracking', desc: 'Automatic depletion of paneer, chicken, spices with low-stock warnings.' },
    { title: 'Multi-Branch & Cloud Kitchen Support', desc: 'Unified central menu management across multiple outlets and franchisees.' },
    { title: 'Advanced Profit & Sales Analytics', desc: 'Peak hour heatmaps, dish profitability breakdown, and customer cohort retention.' },
    { title: 'Customer CRM & Automated SMS Marketing', desc: 'Re-engage customers who haven’t ordered in 14 days with automated coupon SMS.' },
    { title: 'Branded Native iOS & Android Apps', desc: 'Play Store & App Store apps with push notifications and home screen icon.' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-serif font-bold text-white">Restaurant Settings & Config</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage operational preferences, delivery fee thresholds, and WhatsApp numbers.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#141722] border border-[#232837] rounded-2xl p-6 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Store Details & Operational Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1">Restaurant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">WhatsApp Business Number</label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Free Delivery Minimum (₹)</label>
            <input
              type="number"
              value={formData.freeDeliveryThreshold}
              onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Standard Delivery Fee (₹)</label>
            <input
              type="number"
              value={formData.defaultDeliveryFee}
              onChange={(e) => setFormData({ ...formData, defaultDeliveryFee: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-300 block mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Operating Hours</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#202534] flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={formData.acceptingOrders}
              onChange={(e) => setFormData({ ...formData, acceptingOrders: e.target.checked })}
              className="rounded text-amber-500 focus:ring-0"
            />
            <span className="text-white font-medium">Currently Accepting Online Orders</span>
          </label>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* SECTION 24: COMING IN PHASE 2 ROADMAP */}
      <div className="bg-gradient-to-br from-[#121622] via-[#141722] to-[#121622] border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#242b3b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Phase-2 Growth Architecture
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                Coming in Phase 2
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            Enterprise Expansion Ready
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          The Phase-1 codebase has been modularly engineered with dedicated service boundaries. As your order volume multiplies, these advanced capabilities can be unlocked without discarding your initial investment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {phase2Features.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#171b26] border border-[#252c3c] hover:border-amber-500/30 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 text-[11px] font-bold font-mono flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-white">{feat.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

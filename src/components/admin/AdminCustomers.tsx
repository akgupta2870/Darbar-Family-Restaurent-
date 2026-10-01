import React, { useState } from 'react';
import { Users, Search, Phone, Mail, Award, ArrowUpRight } from 'lucide-react';
import { Customer } from '../../types';

interface AdminCustomersProps {
  customers: Customer[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers }) => {
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Customer Database & Retention</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered direct diners. Direct phone records allow SMS marketing and WhatsApp loyalty broadcasts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name or phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141722] border border-[#262c3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="bg-[#141722] border border-[#232837] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202534] bg-[#11131c] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Favorite Dish</th>
                <th className="py-3.5 px-4 text-right">Last Ordered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2331]">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#181c28] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{customer.name}</div>
                    <div className="text-[10px] text-amber-400/80 font-mono">ID: {customer.id}</div>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="text-slate-300 font-mono flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{customer.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-[#1c212e] border border-[#2c3344]">
                      {customer.totalOrders} Orders
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium">
                      {customer.favoriteDish}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                    {customer.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

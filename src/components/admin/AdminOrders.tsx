import React, { useState } from 'react';
import { Search, Filter, Eye, Phone, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: string[] = ['All', 'Received', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'All' && o.orderStatus !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      return matchId || matchCust || matchPhone;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Received':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Confirmed':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Preparing':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Ready':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Out for Delivery':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Order Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor incoming orders, adjust kitchen prep, and advance delivery status.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order or customer..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141722] border border-[#262c3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === st
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-[#141722] text-slate-400 hover:text-white border border-[#242937]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#141722] border border-[#232837] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202534] bg-[#11131c] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Type</th>
                <th className="py-3.5 px-4">Status & Action</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2331]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#181c28] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    #{order.orderId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{order.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="text-slate-300 font-medium truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{order.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ₹{order.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-slate-300">
                      {order.orderType === 'Delivery' ? '🛵 Delivery' : '🏬 Pickup'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateStatus(order.orderId, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded bg-[#1c212e] border border-[#2b3243] text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Received">Received</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 hover:bg-[#202534] rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="View full receipt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141722] border border-[#282f40] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#222736]">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold">#{selectedOrder.orderId}</span>
                <h3 className="text-base font-serif font-bold text-white">Order Details</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-white">{selectedOrder.customerName} ({selectedOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fulfillment:</span>
                <span>{selectedOrder.orderType}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Address:</span>
                  <span className="text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                </div>
              )}
            </div>

            <div className="py-2 border-y border-[#222736] space-y-2 max-h-48 overflow-y-auto">
              {selectedOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs">
                  <div>
                    <span className="font-medium text-white">{it.quantity}x {it.menuItem.name}</span>
                    {it.selectedAddOns?.length > 0 && (
                      <div className="text-[10px] text-slate-400">
                        {it.selectedAddOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono">₹{it.itemTotal}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-white">₹{selectedOrder.deliveryFee}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#222736]">
                <span>Grand Total</span>
                <span className="font-mono text-amber-400">₹{selectedOrder.total}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-[#202534] hover:bg-[#282f42] text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

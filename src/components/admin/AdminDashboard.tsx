import React from 'react';
import { ShoppingBag, IndianRupee, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  onNavigateTab: (tab: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onNavigateTab,
  onUpdateStatus,
}) => {
  const totalOrdersCount = 42 + orders.length - 5;
  const totalRevenue = 18420 + orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0) - 1888;
  const pendingCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const completedCount = 35 + orders.filter((o) => o.orderStatus === 'Delivered').length - 2;

  const statCards = [
    {
      title: "Today's Orders",
      value: totalOrdersCount,
      subtext: "+18% from yesterday",
      icon: ShoppingBag,
      color: "text-amber-800",
      bg: "bg-amber-100",
      border: "border-amber-200",
    },
    {
      title: "Today's Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtext: "Direct zero-commission sales",
      icon: IndianRupee,
      color: "text-emerald-800",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
    },
    {
      title: "Pending Kitchen Orders",
      value: pendingCount,
      subtext: "Require chef attention",
      icon: Clock,
      color: "text-orange-800",
      bg: "bg-orange-100",
      border: "border-orange-200",
    },
    {
      title: "Completed Orders",
      value: completedCount,
      subtext: "Delivered & settled",
      icon: CheckCircle2,
      color: "text-sky-800",
      bg: "bg-sky-100",
      border: "border-sky-200",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Received':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Preparing':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Ready':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 font-bold';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-white border ${stat.border} shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900">
                  {stat.value}
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-1">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Orders Feed */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Live Kitchen Orders
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Real-time dispatch board. Update status to trigger customer WhatsApp & SMS.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-amber-800">
                    #{o.orderId}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-stone-900">{o.customerName}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{o.phone}</div>
                  </td>
                  <td className="py-3.5 px-3 max-w-[200px]">
                    <div className="text-stone-700 font-medium truncate">
                      {o.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{o.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-900">
                    ₹{o.total}
                    <div className="text-[10px] text-stone-500 font-normal">{o.paymentMethod}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-stone-700 font-medium">
                      {o.orderType === 'Delivery' ? '🛵 Delivery' : '🏬 Pickup'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => onUpdateStatus(o.orderId, e.target.value as OrderStatus)}
                      className="px-2 py-1 rounded bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
                    >
                      <option value="Received">Received</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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

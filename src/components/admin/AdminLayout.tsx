import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, Users, Settings, ArrowLeft, ShieldCheck, Calendar } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { MenuItem, Offer, Customer } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminReservations } from './AdminReservations';
import { AdminMenu } from './AdminMenu';
import { AdminOffers } from './AdminOffers';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  onBackToStore: () => void;
  menuItems: MenuItem[];
  onRefreshMenu: () => void;
  offers: Offer[];
  onRefreshOffers: () => void;
  customers: Customer[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onBackToStore,
  menuItems,
  onRefreshMenu,
  offers,
  onRefreshOffers,
  customers,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'reservations' | 'menu' | 'offers' | 'customers' | 'settings'>('dashboard');
  const { orders, updateOrderStatus, restaurantSettings } = useOrder();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'reservations', label: 'Table Cabins', icon: Calendar },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-stone-900">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 border border-stone-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-stone-900">
              {restaurantSettings.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kitchen Open & Accepting Orders</span>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Navigation Bar / Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="bg-white border border-stone-200 rounded-2xl p-2.5 space-y-1 sticky top-22 shadow-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-stone-950 text-amber-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Tab Content Display */}
          <main className="lg:col-span-9 min-h-[500px]">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                orders={orders}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
                onUpdateStatus={updateOrderStatus}
              />
            )}
            {activeTab === 'orders' && (
              <AdminOrders
                orders={orders}
                onUpdateStatus={updateOrderStatus}
              />
            )}
            {activeTab === 'reservations' && <AdminReservations />}
            {activeTab === 'menu' && (
              <AdminMenu
                menuItems={menuItems}
                onRefreshMenu={onRefreshMenu}
              />
            )}
            {activeTab === 'offers' && (
              <AdminOffers
                offers={offers}
                onRefreshOffers={onRefreshOffers}
              />
            )}
            {activeTab === 'customers' && (
              <AdminCustomers customers={customers} />
            )}
            {activeTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </div>
  );
};

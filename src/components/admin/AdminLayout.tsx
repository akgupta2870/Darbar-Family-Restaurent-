import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, Users, Settings, ArrowLeft, ShieldCheck, Calendar, Lock, KeyRound, LogOut } from 'lucide-react';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('darbar_admin_auth') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'reservations' | 'menu' | 'offers' | 'customers' | 'settings'>('dashboard');
  const { orders, updateOrderStatus, restaurantSettings } = useOrder();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().toLowerCase();
    if (cleanPin === '1234' || cleanPin === 'darbar' || cleanPin === 'admin' || cleanPin === 'darbar2024') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('darbar_admin_auth', 'true');
      }
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('darbar_admin_auth');
    }
    onBackToStore();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 text-stone-100">
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Darbar Staff Portal
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Restricted management area for kitchen and restaurant staff.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 text-left mb-1.5 uppercase tracking-wider">
                Staff Passcode / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="Enter staff PIN (default: 1234)"
                  autoFocus
                  className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none transition-colors text-center tracking-widest font-mono"
                />
                <KeyRound className="w-4 h-4 text-stone-500 absolute right-3.5 top-3.5" />
              </div>
              {pinError && (
                <p className="text-rose-400 text-xs mt-2 font-medium">
                  Invalid PIN. Use default staff passcode <code className="bg-stone-800 px-1 py-0.5 rounded text-amber-300">1234</code> or <code className="bg-stone-800 px-1 py-0.5 rounded text-amber-300">darbar</code>.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Verify & Open Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={onBackToStore}
              className="text-xs text-stone-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Menu & Ordering</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Live Status indicator & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kitchen Open & Accepting Orders</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
            title="Lock Staff Portal and return to menu"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Exit</span>
          </button>
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

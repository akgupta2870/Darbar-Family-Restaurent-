'use client';

import React from 'react';
import { CartProvider } from '../../src/context/CartContext';
import { OrderProvider } from '../../src/context/OrderContext';
import { Header } from '../../src/components/common/Header';
import { Footer } from '../../src/components/common/Footer';
import { MobileBottomNav } from '../../src/components/common/MobileBottomNav';
import { Toast } from '../../src/components/common/Toast';
import { OrderTrackingPage } from '../../src/components/order/OrderTrackingPage';

export default function NextTrackPage() {
  const handleNavigate = (view: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = view === 'home' ? '/' : `/${view}`;
    }
  };

  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
          <Header currentView="track" onNavigate={handleNavigate} />
          <Toast />

          <main className="flex-1">
            <OrderTrackingPage onBackToMenu={() => handleNavigate('menu')} />
          </main>

          <Footer onNavigate={handleNavigate} />
          <MobileBottomNav currentView="track" onNavigate={handleNavigate} />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

'use client';

import React from 'react';
import { CartProvider } from '../../src/context/CartContext';
import { OrderProvider } from '../../src/context/OrderContext';
import { Header } from '../../src/components/common/Header';
import { Footer } from '../../src/components/common/Footer';
import { MobileBottomNav } from '../../src/components/common/MobileBottomNav';
import { Toast } from '../../src/components/common/Toast';
import { CheckoutPage } from '../../src/components/checkout/CheckoutPage';
import { Order } from '../../src/types';

export default function NextCheckoutPage() {
  const handleNavigate = (view: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = view === 'home' ? '/' : `/${view}`;
    }
  };

  const handleOrderSuccess = (order: Order) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/track?id=${order.orderId}`;
    }
  };

  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
          <Header currentView="checkout" onNavigate={handleNavigate} />
          <Toast />

          <main className="flex-1">
            <CheckoutPage
              onBackToMenu={() => handleNavigate('menu')}
              onOrderSuccess={handleOrderSuccess}
            />
          </main>

          <Footer onNavigate={handleNavigate} />
          <MobileBottomNav currentView="checkout" onNavigate={handleNavigate} />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

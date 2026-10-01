'use client';

import React, { useState } from 'react';
import { CartProvider } from '../../src/context/CartContext';
import { OrderProvider } from '../../src/context/OrderContext';
import { Header } from '../../src/components/common/Header';
import { Footer } from '../../src/components/common/Footer';
import { MobileBottomNav } from '../../src/components/common/MobileBottomNav';
import { Toast } from '../../src/components/common/Toast';
import { OffersBanner } from '../../src/components/home/OffersBanner';
import { CartDrawer } from '../../src/components/cart/CartDrawer';
import { ReservationModal } from '../../src/components/home/ReservationModal';

export default function NextOffersPage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const handleNavigate = (view: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = view === 'home' ? '/' : `/${view}`;
    }
  };

  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
          <Header
            currentView="offers"
            onNavigate={handleNavigate}
            onOpenReservation={() => setIsReservationOpen(true)}
          />
          <Toast />

          <main className="flex-1 py-8">
            <OffersBanner />
          </main>

          <CartDrawer
            onProceedToCheckout={() => handleNavigate('checkout')}
            onExploreMenu={() => handleNavigate('menu')}
          />

          <ReservationModal
            isOpen={isReservationOpen}
            onClose={() => setIsReservationOpen(false)}
          />

          <Footer onNavigate={handleNavigate} />
          <MobileBottomNav currentView="offers" onNavigate={handleNavigate} />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

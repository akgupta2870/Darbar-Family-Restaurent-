'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider } from '../../src/context/CartContext';
import { OrderProvider } from '../../src/context/OrderContext';
import { FirebaseService } from '../../src/services/firebaseService';
import { MenuItem } from '../../src/types';

import { Header } from '../../src/components/common/Header';
import { Footer } from '../../src/components/common/Footer';
import { MobileBottomNav } from '../../src/components/common/MobileBottomNav';
import { Toast } from '../../src/components/common/Toast';
import { MenuPage } from '../../src/components/menu/MenuPage';
import { FoodDetailModal } from '../../src/components/menu/FoodDetailModal';
import { CartDrawer } from '../../src/components/cart/CartDrawer';
import { ReservationModal } from '../../src/components/home/ReservationModal';

export default function NextMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<MenuItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  useEffect(() => {
    FirebaseService.getMenuItems().then(setMenuItems);
  }, []);

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
            currentView="menu"
            onNavigate={handleNavigate}
            onOpenReservation={() => setIsReservationOpen(true)}
          />
          <Toast />

          <main className="flex-1">
            <MenuPage
              menuItems={menuItems}
              onSelectForDetails={(item) => setSelectedItemForDetails(item)}
              onProceedToCheckout={() => handleNavigate('checkout')}
            />
          </main>

          <CartDrawer
            onProceedToCheckout={() => handleNavigate('checkout')}
            onExploreMenu={() => handleNavigate('menu')}
          />

          {selectedItemForDetails && (
            <FoodDetailModal
              item={selectedItemForDetails}
              onClose={() => setSelectedItemForDetails(null)}
            />
          )}

          <ReservationModal
            isOpen={isReservationOpen}
            onClose={() => setIsReservationOpen(false)}
          />

          <Footer onNavigate={handleNavigate} />
          <MobileBottomNav currentView="menu" onNavigate={handleNavigate} />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

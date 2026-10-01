'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from '../src/context/CartContext';
import { OrderProvider, useOrder } from '../src/context/OrderContext';
import { FirebaseService } from '../src/services/firebaseService';
import { MenuItem, Offer, Customer, Order } from '../src/types';

// Components
import { Header } from '../src/components/common/Header';
import { Footer } from '../src/components/common/Footer';
import { MobileBottomNav } from '../src/components/common/MobileBottomNav';
import { Toast } from '../src/components/common/Toast';
import { Hero } from '../src/components/home/Hero';
import { OffersBanner } from '../src/components/home/OffersBanner';
import { TodaySpecial } from '../src/components/home/TodaySpecial';
import { PopularDishes } from '../src/components/home/PopularDishes';
import { WhyChooseUs } from '../src/components/home/WhyChooseUs';
import { Reviews } from '../src/components/home/Reviews';
import { RestaurantInfo } from '../src/components/home/RestaurantInfo';
import { FoodDetailModal } from '../src/components/menu/FoodDetailModal';
import { CartDrawer } from '../src/components/cart/CartDrawer';
import { ReservationModal } from '../src/components/home/ReservationModal';

export default function NextHomePage() {
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
            currentView="home"
            onNavigate={handleNavigate}
            onOpenReservation={() => setIsReservationOpen(true)}
          />
          <Toast />

          <main className="flex-1">
            <Hero
              onOrderNow={() => handleNavigate('menu')}
              onViewMenu={() => handleNavigate('menu')}
              onSeeAllOffers={() => handleNavigate('offers')}
            />
            <TodaySpecial
              items={menuItems}
              onSelectForDetails={(item) => setSelectedItemForDetails(item)}
              onViewMenu={() => handleNavigate('menu')}
            />
            <PopularDishes
              items={menuItems}
              onSelectForDetails={(item) => setSelectedItemForDetails(item)}
              onViewMenu={() => handleNavigate('menu')}
            />
            <OffersBanner />
            <WhyChooseUs />
            <Reviews />
            <RestaurantInfo />
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
          <MobileBottomNav currentView="home" onNavigate={handleNavigate} />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

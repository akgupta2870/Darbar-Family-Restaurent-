/**
 * Zaika Junction - Online Ordering Web Application
 * Production-quality Phase-1 demo proposal for restaurant owners.
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrder } from './context/OrderContext';
import { FirebaseService } from './services/firebaseService';
import { MenuItem, Offer, Customer, Order } from './types';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Toast } from './components/common/Toast';
import { DemoController } from './components/common/DemoController';

// Storefront Components
import { Hero } from './components/home/Hero';
import { OffersBanner } from './components/home/OffersBanner';
import { TodaySpecial } from './components/home/TodaySpecial';
import { PopularDishes } from './components/home/PopularDishes';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { Reviews } from './components/home/Reviews';
import { RestaurantInfo } from './components/home/RestaurantInfo';
import { StorySection } from './components/home/StorySection';

// Menu & Details
import { MenuPage } from './components/menu/MenuPage';
import { FoodDetailModal } from './components/menu/FoodDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ReservationModal } from './components/home/ReservationModal';

// Checkout & Order Tracking
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmedPage } from './components/order/OrderConfirmedPage';
import { OrderTrackingPage } from './components/order/OrderTrackingPage';

// Admin Portal
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'offers' | 'track' | 'checkout' | 'confirmed' | 'story' | 'admin'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<MenuItem | null>(null);
  const [latestConfirmedOrder, setLatestConfirmedOrder] = useState<Order | null>(null);
  const [isGlobalReservationOpen, setIsGlobalReservationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setIsCartOpen } = useCart();
  const { setActiveOrder } = useOrder();

  const loadData = async () => {
    setIsLoading(true);
    const [fetchedItems, fetchedOffers, fetchedCustomers] = await Promise.all([
      FirebaseService.getMenuItems(),
      FirebaseService.getOffers(),
      FirebaseService.getCustomers(),
    ]);
    setMenuItems(fetchedItems);
    setOffers(fetchedOffers);
    setCustomers(fetchedCustomers);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLatestConfirmedOrder(order);
    setActiveOrder(order);
    setCurrentView('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing Admin Portal, render dedicated AdminLayout
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#f8f7f4] text-stone-900">
        <Toast />
        <AdminLayout
          onBackToStore={() => handleNavigate('home')}
          menuItems={menuItems}
          onRefreshMenu={loadData}
          offers={offers}
          onRefreshOffers={loadData}
          customers={customers}
        />
        <DemoController currentView={currentView} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
      {/* Global Top Bar matching PDF screenshot */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsGlobalReservationOpen(true)}
      />

      {/* Global Notifications (Simulated WhatsApp & SMS Alerts) */}
      <Toast />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
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
          </>
        )}

        {currentView === 'menu' && (
          <MenuPage
            menuItems={menuItems}
            onSelectForDetails={(item) => setSelectedItemForDetails(item)}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {currentView === 'offers' && (
          <div className="py-6">
            <OffersBanner />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <TodaySpecial
                items={menuItems}
                onSelectForDetails={(item) => setSelectedItemForDetails(item)}
                onViewMenu={() => handleNavigate('menu')}
              />
            </div>
          </div>
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToMenu={() => handleNavigate('menu')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'confirmed' && latestConfirmedOrder && (
          <OrderConfirmedPage
            order={latestConfirmedOrder}
            onTrackOrder={() => handleNavigate('track')}
            onContinueShopping={() => handleNavigate('menu')}
          />
        )}

        {currentView === 'track' && (
          <OrderTrackingPage onBackToMenu={() => handleNavigate('menu')} />
        )}

        {currentView === 'story' && <StorySection />}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onExploreMenu={() => handleNavigate('menu')}
      />

      {/* Food Details & Add-ons Customization Modal */}
      {selectedItemForDetails && (
        <FoodDetailModal
          item={selectedItemForDetails}
          onClose={() => setSelectedItemForDetails(null)}
        />
      )}

      {/* Global Table & Cabin Reservation Modal */}
      <ReservationModal
        isOpen={isGlobalReservationOpen}
        onClose={() => setIsGlobalReservationOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />

      {/* Pitch Demo Controller for 5-10 min restaurant owner meeting */}
      <DemoController currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <MainApp />
      </OrderProvider>
    </CartProvider>
  );
}

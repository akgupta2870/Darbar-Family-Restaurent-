'use client';

import React, { useState, useEffect } from 'react';
import { CartProvider } from '../../src/context/CartContext';
import { OrderProvider } from '../../src/context/OrderContext';
import { FirebaseService } from '../../src/services/firebaseService';
import { MenuItem, Offer, Customer } from '../../src/types';
import { AdminLayout } from '../../src/components/admin/AdminLayout';
import { Toast } from '../../src/components/common/Toast';

export default function NextAdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadData = async () => {
    const [fetchedItems, fetchedOffers, fetchedCustomers] = await Promise.all([
      FirebaseService.getMenuItems(),
      FirebaseService.getOffers(),
      FirebaseService.getCustomers(),
    ]);
    setMenuItems(fetchedItems);
    setOffers(fetchedOffers);
    setCustomers(fetchedCustomers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBackToStore = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen bg-[#f8f7f4] text-stone-900">
          <Toast />
          <AdminLayout
            onBackToStore={handleBackToStore}
            menuItems={menuItems}
            onRefreshMenu={loadData}
            offers={offers}
            onRefreshOffers={loadData}
            customers={customers}
          />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

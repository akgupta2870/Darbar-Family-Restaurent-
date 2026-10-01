import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, PaymentMethod, CustomerInfo, RestaurantSettings, TableReservation } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { NotificationService, NotificationEvent } from '../services/notificationService';
import { useCart } from './CartContext';
import { INITIAL_RESTAURANT_SETTINGS } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  restaurantSettings: RestaurantSettings;
  updateSettings: (settings: RestaurantSettings) => Promise<void>;
  recentNotification: NotificationEvent | null;
  clearNotification: () => void;
  toast: { title: string; message: string; type?: 'success' | 'info' | 'whatsapp' | 'sms' } | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'whatsapp' | 'sms') => void;
  clearToast: () => void;
  tableReservations: TableReservation[];
  bookTable: (
    reservation: Omit<TableReservation, 'id' | 'createdAt' | 'status'>
  ) => Promise<TableReservation>;
  updateReservationStatus: (id: string, status: TableReservation['status']) => Promise<void>;
  refreshReservations: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cartItems, subtotal, deliveryFee, discountAmount, grandTotal, appliedCoupon, orderType, tableNumber, clearCart } = useCart();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [tableReservations, setTableReservations] = useState<TableReservation[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(INITIAL_RESTAURANT_SETTINGS);
  const [recentNotification, setRecentNotification] = useState<NotificationEvent | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type?: 'success' | 'info' | 'whatsapp' | 'sms' } | null>(null);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'whatsapp' | 'sms' = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const clearNotification = useCallback(() => {
    setRecentNotification(null);
  }, []);

  const refreshOrders = useCallback(async () => {
    const fetched = await FirebaseService.getOrders();
    setOrders(fetched);
    if (activeOrder) {
      const updated = fetched.find((o) => o.id === activeOrder.id);
      if (updated) setActiveOrder(updated);
    }
  }, [activeOrder]);

  const refreshReservations = useCallback(async () => {
    const fetched = await FirebaseService.getTableReservations();
    setTableReservations(fetched);
  }, []);

  useEffect(() => {
    refreshOrders();
    refreshReservations();
    FirebaseService.getSettings().then(setRestaurantSettings);

    const unsubscribe = NotificationService.subscribe((event) => {
      setRecentNotification(event);
      showToast(
        event.title,
        event.message,
        event.type === 'whatsapp' ? 'whatsapp' : 'sms'
      );
    });

    return () => unsubscribe();
  }, [refreshOrders, refreshReservations, showToast]);

  const placeOrder = async (customerInfo: CustomerInfo, paymentMethod: PaymentMethod): Promise<Order> => {
    const orderData = {
      customerId: `cust-${Date.now()}`,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      orderType,
      tableNumber: orderType === 'Dine-In' ? (customerInfo.tableNumber || tableNumber) : undefined,
      items: [...cartItems],
      subtotal,
      deliveryFee: orderType === 'Dine-In' ? 0 : deliveryFee,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      total: grandTotal,
      paymentMethod,
      paymentStatus: (paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid') as 'Pending' | 'Paid',
      orderStatus: 'Received' as OrderStatus,
      deliveryAddress: customerInfo.deliveryAddress,
      landmark: customerInfo.landmark,
      pincode: customerInfo.pincode,
      estimatedDeliveryMinutes: orderType === 'Dine-In' ? 18 : 35,
    };

    const newOrder = await FirebaseService.createOrder(orderData);
    setActiveOrder(newOrder);
    await refreshOrders();
    clearCart();

    // Trigger WhatsApp & SMS automation simulation
    NotificationService.sendOrderPlacedNotifications(newOrder, restaurantSettings.whatsappNumber);

    return newOrder;
  };

  const bookTable = async (
    reservationData: Omit<TableReservation, 'id' | 'createdAt' | 'status'>
  ): Promise<TableReservation> => {
    const created = await FirebaseService.createTableReservation(reservationData);
    await refreshReservations();

    showToast(
      'Table Confirmed!',
      `Reserved for ${created.guestsCount} guests on ${created.date} (${created.timeSlot}) in ${created.seatingArea}. Confirmation SMS dispatched!`,
      'success'
    );

    return created;
  };

  const updateReservationStatus = async (id: string, status: TableReservation['status']) => {
    await FirebaseService.updateReservationStatus(id, status);
    await refreshReservations();
    showToast('Reservation Updated', `Booking status changed to ${status}`, 'info');
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const updated = await FirebaseService.updateOrderStatus(orderId, status, note);
    if (updated) {
      await refreshOrders();
      if (activeOrder && (activeOrder.id === orderId || activeOrder.orderId === orderId)) {
        setActiveOrder(updated);
      }
      NotificationService.sendStatusUpdateNotification(updated, status);
      showToast(
        'Order Updated',
        `Order #${orderId} moved to ${status}`,
        'success'
      );
    }
  };

  const updateSettings = async (settings: RestaurantSettings) => {
    const updated = await FirebaseService.updateSettings(settings);
    setRestaurantSettings(updated);
    showToast('Settings Saved', 'Restaurant preferences updated successfully', 'success');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        refreshOrders,
        restaurantSettings,
        updateSettings,
        recentNotification,
        clearNotification,
        toast,
        showToast,
        clearToast,
        tableReservations,
        bookTable,
        updateReservationStatus,
        refreshReservations,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

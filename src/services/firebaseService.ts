/**
 * Modular Firebase / Firestore Service Layer
 * 
 * Provides an identical async interface to Google Cloud Firestore (collections, doc references, queries)
 * while operating with persistent LocalStorage + Memory synchronization for zero-config live demo reliability.
 * Can be swapped directly to real Firestore SDK by replacing this module with `getFirestore()`, `collection()`, `getDocs()`.
 */

import { MenuItem, Order, Offer, Customer, RestaurantSettings, OrderStatus, TableReservation } from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_OFFERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_RESTAURANT_SETTINGS 
} from '../data/mockData';

const INITIAL_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-101',
    customerName: 'Rajesh Kapoor',
    phone: '+91 98112 44556',
    email: 'rajesh.k@example.com',
    guestsCount: 6,
    date: 'Today, Oct 1',
    timeSlot: '8:00 PM - Dinner',
    seatingArea: 'Private Family Booth',
    specialOccasion: 'Anniversary',
    specialRequests: 'High chair needed for 3yo child, flower decor on table',
    status: 'Confirmed',
    tableAssigned: 'Booth B-4',
    createdAt: 'Today, 2:15 PM',
  },
  {
    id: 'res-102',
    customerName: 'Dr. Arvinder Singh',
    phone: '+91 98223 55667',
    email: 'arvinder.s@example.com',
    guestsCount: 4,
    date: 'Tonight',
    timeSlot: '8:30 PM - Dinner',
    seatingArea: 'Main Royal Dining Hall',
    specialOccasion: 'Family Get-Together',
    specialRequests: 'Quiet corner table near indoor fountain',
    status: 'Seated',
    tableAssigned: 'Royal Table R-8',
    createdAt: 'Yesterday',
  },
  {
    id: 'res-103',
    customerName: 'Vikram Malhotra',
    phone: '+91 98334 66778',
    email: 'vikram.m@example.com',
    guestsCount: 8,
    date: 'Tomorrow, Oct 2',
    timeSlot: '1:30 PM - Family Lunch',
    seatingArea: 'First Floor Balcony View',
    specialOccasion: 'Birthday',
    specialRequests: 'Birthday cake cutting arrangement at table',
    status: 'Confirmed',
    tableAssigned: 'Balcony Suite F-1',
    createdAt: 'Today, 11:00 AM',
  },
];

const STORAGE_KEYS = {
  MENU_ITEMS: 'zj_firestore_menu_items',
  ORDERS: 'zj_firestore_orders',
  OFFERS: 'zj_firestore_offers',
  CUSTOMERS: 'zj_firestore_customers',
  SETTINGS: 'zj_firestore_settings',
  RESERVATIONS: 'zj_firestore_reservations',
};

// Safe storage helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

export const FirebaseService = {
  // --- MENU ITEMS COLLECTION ---
  async getMenuItems(): Promise<MenuItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
        resolve(items);
      }, 80);
    });
  },

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const items = getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    const updated = [newItem, ...items];
    setStored(STORAGE_KEYS.MENU_ITEMS, updated);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const items = getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    setStored(STORAGE_KEYS.MENU_ITEMS, items);
    return items[index];
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    const items = getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    const filtered = items.filter((i) => i.id !== id);
    setStored(STORAGE_KEYS.MENU_ITEMS, filtered);
    return true;
  },

  // --- ORDERS COLLECTION ---
  async getOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
        resolve(orders);
      }, 80);
    });
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const found = orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase() || o.orderId.toLowerCase() === orderId.toLowerCase());
    return found || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderId' | 'createdAt' | 'statusHistory'>): Promise<Order> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `DB${randomNum}`;
    
    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      orderId: newOrderId,
      createdAt: 'Just now',
      statusHistory: [
        {
          status: 'Received',
          timestamp: 'Just now',
          note: 'Order placed through online platform',
        },
      ],
    };

    const updated = [newOrder, ...orders];
    setStored(STORAGE_KEYS.ORDERS, updated);

    // Also update customer records
    const customers = getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const existingCust = customers.find((c) => c.phone === orderData.phone);
    if (existingCust) {
      existingCust.totalOrders += 1;
      existingCust.totalSpent += orderData.total;
      existingCust.lastOrderDate = 'Just now';
      setStored(STORAGE_KEYS.CUSTOMERS, customers);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email || 'customer@example.com',
        totalOrders: 1,
        totalSpent: orderData.total,
        lastOrderDate: 'Just now',
        favoriteDish: orderData.items[0]?.menuItem.name || 'Indian Delicacies',
      };
      setStored(STORAGE_KEYS.CUSTOMERS, [newCust, ...customers]);
    }

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null> {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const index = orders.findIndex((o) => o.id === orderId || o.orderId === orderId);
    if (index === -1) return null;

    const order = orders[index];
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: 'Just now',
      note: note || `Order updated to ${status}`,
    });

    if (status === 'Delivered') {
      order.estimatedDeliveryMinutes = 0;
      if (order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = 'Paid';
      }
    }

    orders[index] = order;
    setStored(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  // --- OFFERS COLLECTION ---
  async getOffers(): Promise<Offer[]> {
    return getStored<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  },

  async saveOffer(offer: Offer): Promise<Offer> {
    const offers = getStored<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    const index = offers.findIndex((o) => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.unshift(offer);
    }
    setStored(STORAGE_KEYS.OFFERS, offers);
    return offer;
  },

  // --- CUSTOMERS COLLECTION ---
  async getCustomers(): Promise<Customer[]> {
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  // --- RESTAURANT SETTINGS ---
  async getSettings(): Promise<RestaurantSettings> {
    return getStored<RestaurantSettings>(STORAGE_KEYS.SETTINGS, INITIAL_RESTAURANT_SETTINGS);
  },

  async updateSettings(settings: RestaurantSettings): Promise<RestaurantSettings> {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // --- TABLE RESERVATIONS (FINE DINING) ---
  async getTableReservations(): Promise<TableReservation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reservations = getStored<TableReservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
        resolve(reservations);
      }, 50);
    });
  },

  async createTableReservation(
    data: Omit<TableReservation, 'id' | 'createdAt' | 'status'>
  ): Promise<TableReservation> {
    const list = getStored<TableReservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    const newReservation: TableReservation = {
      ...data,
      id: `res-${Date.now()}`,
      status: 'Confirmed',
      tableAssigned: data.seatingArea.includes('Booth') ? 'Booth B-' + Math.floor(1 + Math.random() * 8) : 'Table R-' + Math.floor(1 + Math.random() * 12),
      createdAt: 'Just now',
    };
    const updated = [newReservation, ...list];
    setStored(STORAGE_KEYS.RESERVATIONS, updated);
    return newReservation;
  },

  async updateReservationStatus(
    id: string,
    status: TableReservation['status']
  ): Promise<TableReservation | null> {
    const list = getStored<TableReservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    setStored(STORAGE_KEYS.RESERVATIONS, list);
    return list[idx];
  },

  // Reset to initial demo data
  resetDemoData(): void {
    setStored(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    setStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStored(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    setStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStored(STORAGE_KEYS.SETTINGS, INITIAL_RESTAURANT_SETTINGS);
    setStored(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  },
};

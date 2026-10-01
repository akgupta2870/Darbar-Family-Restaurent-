export type FoodCategory =
  | 'Starters'
  | 'Main Course'
  | 'Breads'
  | 'Rice & Biryani'
  | 'Chinese'
  | 'Beverages'
  | 'Desserts';

export type FoodType = 'veg' | 'non-veg';

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  price: number;
  type: FoodType;
  image: string;
  isBestseller?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes?: number;
  availableAddOns?: AddOnOption[];
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  quantity: number;
  selectedAddOns: AddOnOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus =
  | 'Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type OrderType = 'Delivery' | 'Pickup' | 'Dine-In';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  landmark?: string;
  pincode: string;
  tableNumber?: string;
}

export interface TableReservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  guestsCount: number;
  date: string;
  timeSlot: string;
  seatingArea: 'Main Royal Dining Hall' | 'Private Family Booth' | 'First Floor Balcony View' | 'Cafe & Student Lounge';
  specialOccasion?: 'Birthday' | 'Anniversary' | 'Family Get-Together' | 'Business Dinner' | 'None';
  specialRequests?: string;
  status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled';
  tableAssigned?: string;
  createdAt: string;
}

export interface Order {
  id: string; // e.g., #DB1024
  orderId: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: OrderType;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress?: string;
  landmark?: string;
  pincode?: string;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  badge?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteDish: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  minOrderValue: number;
  freeDeliveryThreshold: number;
  defaultDeliveryFee: number;
  acceptingOrders: boolean;
}

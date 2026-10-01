import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, AddOnOption, Offer } from '../types';
import { INITIAL_OFFERS } from '../data/mockData';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    menuItem: MenuItem,
    quantity?: number,
    addOns?: AddOnOption[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Offer | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  grandTotal: number;
  totalItemsCount: number;
  orderType: 'Delivery' | 'Pickup' | 'Dine-In';
  setOrderType: (type: 'Delivery' | 'Pickup' | 'Dine-In') => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zj_active_cart';
const COUPON_STORAGE_KEY = 'zj_active_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<'Delivery' | 'Pickup' | 'Dine-In'>('Delivery');
  const [tableNumber, setTableNumber] = useState('Table 4');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Coupon sync error:', err);
    }
  }, [appliedCoupon]);

  const addToCart = (
    menuItem: MenuItem,
    quantity = 1,
    addOns: AddOnOption[] = [],
    specialInstructions = ''
  ) => {
    const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = menuItem.price + addOnTotal;

    // Check if item with exact same addOns and instructions already exists
    const sortedAddonIds = addOns.map((a) => a.id).sort().join(',');
    const existingIndex = cartItems.findIndex((ci) => {
      const ciSortedAddons = ci.selectedAddOns.map((a) => a.id).sort().join(',');
      return (
        ci.menuItem.id === menuItem.id &&
        ciSortedAddons === sortedAddonIds &&
        (ci.specialInstructions || '') === specialInstructions
      );
    });

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].itemTotal = unitPrice * newQty;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItem,
        quantity,
        selectedAddOns: addOns,
        specialInstructions,
        itemTotal: unitPrice * quantity,
      };
      setCartItems((prev) => [newItem, ...prev]);
    }
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const addOnTotal = item.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
          const unitPrice = item.menuItem.price + addOnTotal;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  // Delivery calculation: ₹40 default, FREE if >= ₹499 or pickup or dine-in
  let deliveryFee = 0;
  if (orderType === 'Delivery' && subtotal > 0) {
    if (subtotal >= 499) {
      deliveryFee = 0;
    } else {
      deliveryFee = 40;
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      discountAmount = Math.min(discountAmount, 150);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // If FREEDEL coupon used on below ₹499 order
  if (appliedCoupon?.code === 'FREEDEL' && deliveryFee > 0) {
    discountAmount = deliveryFee;
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);
  const totalItemsCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const offer = INITIAL_OFFERS.find((o) => o.code === clean && o.isActive);

    if (!offer) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (subtotal < offer.minOrder) {
      return {
        success: false,
        message: `Min order of ₹${offer.minOrder} required for ${offer.code} (Current: ₹${subtotal})`,
      };
    }

    setAppliedCoupon(offer);
    return { success: true, message: `Coupon ${offer.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        discountAmount,
        grandTotal,
        totalItemsCount,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

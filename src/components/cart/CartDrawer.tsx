import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMenu,
}) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
  } = useCart();

  const { showToast } = useOrder();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponError('');
      showToast('Coupon Applied', res.message, 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-l border-stone-200 h-full shadow-2xl flex flex-col justify-between text-stone-900 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">Your Order</h2>
              <span className="text-[11px] text-stone-500">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Toggle (Delivery vs Pickup) */}
        <div className="p-3 bg-stone-50/50 border-b border-stone-200 px-4">
          <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setOrderType('Delivery')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                orderType === 'Delivery'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              🛵 Home Delivery
            </button>
            <button
              onClick={() => setOrderType('Pickup')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                orderType === 'Pickup'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              🏬 Restaurant Pickup
            </button>
          </div>
        </div>

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 text-amber-700 flex items-center justify-center text-3xl">
                🍽️
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Your Cart is Empty</h3>
              <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                Add some aromatic butter chicken, handi biryani or hot garlic naan to start your order!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExploreMenu();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center shrink-0 mt-0.5 bg-white ${
                        item.menuItem.type === 'veg'
                          ? 'border-emerald-600'
                          : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.menuItem.type === 'veg'
                            ? 'bg-emerald-600'
                            : 'bg-rose-600'
                        }`}
                      />
                    </span>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-snug">
                        {item.menuItem.name}
                      </div>
                      <div className="text-[11px] text-stone-700 font-mono font-bold">
                        ₹{item.menuItem.price}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.menuItem.name} from cart`}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Selected Add-ons */}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <div className="pl-6 space-y-0.5 text-[11px] text-stone-600">
                    {item.selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between">
                        <span>+ {addon.name}</span>
                        <span className="font-mono text-stone-800 font-medium">+₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Special Instructions Note */}
                {item.specialInstructions && (
                  <div className="pl-6 text-[10px] text-amber-800 font-medium italic">
                    Note: "{item.specialInstructions}"
                  </div>
                )}

                {/* Quantity Controls and Total */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease item quantity"
                      className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-stone-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase item quantity"
                      className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-xs text-stone-900">
                    ₹{item.itemTotal}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Coupon Code Section */}
            {appliedCoupon ? (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-bold text-amber-900">
                    {appliedCoupon.code} applied (-₹{discountAmount})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter Coupon (e.g. DARBAR100)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs uppercase text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}
              </form>
            )}

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-medium">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge {orderType === 'Delivery' && subtotal >= 499 && <span className="text-[10px] text-emerald-700 font-bold">(FREE above ₹499)</span>}</span>
                <span className="font-mono text-stone-900 font-medium">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>Grand Total</span>
                <span className="text-base text-stone-950 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1 font-mono">
                <span>₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

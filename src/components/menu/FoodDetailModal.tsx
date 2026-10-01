import React, { useState } from 'react';
import { X, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { MenuItem, AddOnOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useOrder();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const toggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addOnTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedAddOns, instructions);
    showToast('Added to Cart', `${quantity}x ${item.name} added to your order`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white border border-stone-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-stone-900 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close food details modal"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Food Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Veg / Non-Veg Indicator on Image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center bg-white shadow-xs ${
                item.type === 'veg' ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.type === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className="text-xs font-semibold capitalize text-white drop-shadow">
              {item.type} · {item.category}
            </span>
            {item.isBestseller && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wide">
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {item.name}
              </h3>
              <div className="text-xl font-bold text-stone-900 font-mono shrink-0">
                ₹{item.price}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Add-ons list if available */}
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Customise & Add-Ons
                </label>
                <span className="text-[11px] text-stone-500">Optional</span>
              </div>

              <div className="space-y-2">
                {item.availableAddOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);

                  return (
                    <button
                      type="button"
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-50 border-amber-400 text-stone-900 font-medium'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-mono text-stone-900 font-bold">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <label className="text-xs font-bold text-stone-800">
              Special Cooking Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy / Extra mint chutney / No onion"
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quantity Selector & Add Button */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-stone-900 font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-between shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </div>
              <span className="font-mono font-bold">₹{totalPrice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

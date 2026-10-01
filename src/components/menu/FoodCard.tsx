import React from 'react';
import { Plus, Minus, SlidersHorizontal } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

interface FoodCardProps {
  item: MenuItem;
  onSelectForDetails: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onSelectForDetails }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { showToast } = useOrder();

  const existingCartEntries = cartItems.filter((ci) => ci.menuItem.id === item.id);
  const totalItemQuantity = existingCartEntries.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.availableAddOns && item.availableAddOns.length > 0) {
      onSelectForDetails(item);
    } else {
      addToCart(item, 1);
      showToast('Added to Cart', `${item.name} added to cart`, 'success');
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingCartEntries.length === 1 && (!existingCartEntries[0].selectedAddOns || existingCartEntries[0].selectedAddOns.length === 0)) {
      updateQuantity(existingCartEntries[0].id, existingCartEntries[0].quantity + 1);
    } else {
      onSelectForDetails(item);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingCartEntries.length > 0) {
      const last = existingCartEntries[0];
      updateQuantity(last.id, last.quantity - 1);
    }
  };

  return (
    <div
      onClick={() => onSelectForDetails(item)}
      className="group relative bg-white hover:bg-amber-50/20 border border-stone-200 hover:border-amber-400 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        {/* Card Image Slot */}
        <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-80" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {/* Veg / Non-Veg Icon */}
            <span
              className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center bg-white shadow-xs ${
                item.type === 'veg' ? 'border-emerald-600' : 'border-rose-600'
              }`}
              title={item.type === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.type === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>

            {item.isBestseller && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wide shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium drop-shadow">
            <span className="text-amber-300 font-semibold">{item.category}</span>
            {item.preparationTimeMinutes && (
              <span className="text-stone-200">{item.preparationTimeMinutes} mins</span>
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-serif font-bold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors">
            {item.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Action */}
      <div className="p-4 pt-1 flex items-center justify-between gap-3 border-t border-stone-100">
        <div>
          <span className="text-base font-bold text-stone-900 font-mono">
            ₹{item.price}
          </span>
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div className="text-[10px] text-stone-500 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-2.5 h-2.5 text-amber-700" />
              <span>Customisable</span>
            </div>
          )}
        </div>

        {/* Quantity Controls or Add Button */}
        {totalItemQuantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center border border-amber-400 rounded-lg bg-amber-50 overflow-hidden shadow-xs"
          >
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="p-1.5 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-bold text-amber-950 font-mono">
              {totalItemQuantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="p-1.5 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleQuickAdd}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';
import { biryaniImg } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

interface TodaySpecialProps {
  items: MenuItem[];
  onSelectForDetails: (item: MenuItem) => void;
  onViewMenu: () => void;
}

export const TodaySpecial: React.FC<TodaySpecialProps> = ({
  items,
  onSelectForDetails,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useOrder();

  // Find Chicken Dum Biryani or fallback to first bestseller
  const specialItem = items.find((i) => i.name.toLowerCase().includes('biryani')) || items[0];

  const handleQuickAdd = () => {
    if (specialItem) {
      if (specialItem.availableAddOns && specialItem.availableAddOns.length > 0) {
        onSelectForDetails(specialItem);
      } else {
        addToCart(specialItem, 1);
        showToast('Added to Cart', `${specialItem.name} added to your order`, 'success');
      }
    }
  };

  if (!specialItem) return null;

  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
          {/* Left: Food Image */}
          <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:h-80 bg-stone-100 overflow-hidden cursor-pointer group" onClick={() => onSelectForDetails(specialItem)}>
            <img
              src={specialItem.image || biryaniImg}
              alt={specialItem.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Details */}
          <div className="md:col-span-6 p-6 sm:p-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold bg-[#d97706]/15 text-[#b45309] uppercase tracking-wider">
              Today's Special
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {specialItem.name}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {specialItem.description}
            </p>

            <div className="text-2xl font-bold font-mono text-stone-900 pt-1">
              ₹{specialItem.price}
            </div>

            <div className="pt-2">
              <button
                onClick={handleQuickAdd}
                className="px-6 py-2.5 rounded-md bg-[#d97706] hover:bg-[#b45309] text-stone-950 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Add to order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

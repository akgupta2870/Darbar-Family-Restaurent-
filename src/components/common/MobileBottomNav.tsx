import React from 'react';
import { Home, UtensilsCrossed, Tag, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around h-14 shadow-lg">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'home' ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Home className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('menu')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'menu' ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <UtensilsCrossed className="w-4 h-4 mb-0.5" />
        <span>Menu</span>
      </button>

      <button
        onClick={() => onNavigate('offers')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'offers' ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Tag className="w-4 h-4 mb-0.5" />
        <span>Offers</span>
      </button>

      <button
        onClick={() => onNavigate('track')}
        className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
          currentView === 'track' ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        <Clock className="w-4 h-4 mb-0.5" />
        <span>Orders</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium text-stone-600 hover:text-stone-900 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 text-[10px] font-bold px-1 rounded-full tabular-nums">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
};

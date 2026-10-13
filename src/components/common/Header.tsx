import React from 'react';
import { ShoppingBag, Crown, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenReservation?: () => void;
  onOpenNextJsInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenReservation, onOpenNextJsInfo }) => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Crown icon matching design */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs group-hover:bg-amber-100 transition-colors">
            <Crown className="w-5 h-5 fill-amber-500/20 stroke-amber-700" />
          </div>
          <div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight leading-none">
              DARBAR
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.16em] font-bold text-amber-800 uppercase mt-0.5">
              Fine Dining & Family Restaurant
            </div>
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'text-amber-800 font-bold'
                : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className={`transition-colors cursor-pointer ${
              currentView === 'menu'
                ? 'text-amber-800 font-bold'
                : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => onNavigate('offers')}
            className={`transition-colors cursor-pointer ${
              currentView === 'offers'
                ? 'text-amber-800 font-bold'
                : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => onNavigate('track')}
            className={`transition-colors cursor-pointer ${
              currentView === 'track'
                ? 'text-amber-800 font-bold'
                : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => onNavigate('story')}
            className={`transition-colors cursor-pointer ${
              currentView === 'story'
                ? 'text-amber-800 font-bold'
                : 'hover:text-amber-800 text-stone-600'
            }`}
          >
            Our Story
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {onOpenReservation && (
            <button
              onClick={onOpenReservation}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Book Table</span>
            </button>
          )}


          {/* Golden Pill Cart button matching screenshot */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View shopping cart"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-stone-950 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

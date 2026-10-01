import React, { useState, useMemo } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import { MenuItem, FoodCategory, FoodType } from '../../types';
import { FoodCard } from './FoodCard';
import { useCart } from '../../context/CartContext';

interface MenuPageProps {
  menuItems: MenuItem[];
  onSelectForDetails: (item: MenuItem) => void;
  onProceedToCheckout?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  menuItems,
  onSelectForDetails,
}) => {
  const { totalItemsCount, grandTotal, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodCategory>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const categories: Array<'All' | FoodCategory> = [
    'All',
    'Starters',
    'Main Course',
    'Breads',
    'Rice & Biryani',
    'Chinese',
    'Beverages',
    'Desserts',
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [menuItems, selectedCategory, typeFilter, searchQuery]);

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Kitchen Menu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Explore Darbar Culinary Delights
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Handcrafted with authentic spices, fresh cream, and clay tandoor roasting.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Butter Chicken, Biryani, Naan, Paneer..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-amber-500 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Category Tabs + Veg/Non-Veg Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Veg / Non-Veg Toggle Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('veg')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'veg'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                : 'text-stone-600 hover:text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setTypeFilter('non-veg')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'non-veg'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                : 'text-stone-600 hover:text-rose-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-300 text-amber-700 flex items-center justify-center mx-auto text-2xl">
            🍲
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900">No dishes found</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We couldn't find any dishes matching "{searchQuery}". Try selecting another category or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setTypeFilter('all');
            }}
            className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-amber-800 text-xs font-bold hover:bg-stone-50 transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelectForDetails={onSelectForDetails}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalItemsCount > 0 && (
        <aside
          aria-label="Current cart summary"
          className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-xl mx-auto z-30 animate-in slide-in-from-bottom-6 duration-300"
        >
          <div className="p-3.5 px-5 rounded-2xl bg-amber-500 text-stone-950 shadow-2xl flex items-center justify-between border border-amber-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-950 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
                {totalItemsCount}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold uppercase tracking-wide">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} in Cart
                </div>
                <div className="text-xs text-stone-950 font-bold font-mono">
                  Subtotal: ₹{grandTotal}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

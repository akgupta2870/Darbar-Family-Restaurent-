import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MenuItem } from '../../types';
import { FoodCard } from '../menu/FoodCard';

interface PopularDishesProps {
  items: MenuItem[];
  onSelectForDetails: (item: MenuItem) => void;
  onViewMenu: () => void;
}

export const PopularDishes: React.FC<PopularDishesProps> = ({
  items,
  onSelectForDetails,
  onViewMenu,
}) => {
  // Select the 4 main popular dishes shown in the user's PDF screenshot
  const popularNames = ['butter chicken', 'paneer butter masala', 'chicken dum biryani', 'garlic naan'];
  
  let popularList: MenuItem[] = [];
  popularNames.forEach((pName) => {
    const found = items.find((i) => i.name.toLowerCase().includes(pName));
    if (found && !popularList.includes(found)) popularList.push(found);
  });

  if (popularList.length < 4) {
    items.forEach((i) => {
      if (popularList.length < 4 && !popularList.includes(i)) {
        popularList.push(i);
      }
    });
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header matching Screenshot */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Popular Dishes
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          What everyone orders at Darbar
        </p>
      </div>

      {/* 4-Item Grid matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularList.slice(0, 4).map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onSelectForDetails={onSelectForDetails}
          />
        ))}
      </div>

      {/* Centered Explore Button matching Screenshot */}
      <div className="mt-10 text-center">
        <button
          onClick={onViewMenu}
          className="px-6 py-2.5 rounded-full border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
        >
          Explore the full menu
        </button>
      </div>
    </section>
  );
};

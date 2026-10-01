import React from 'react';
import { Leaf, Users, Star, Bike, Flame, Crown } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const items = [
    {
      icon: Flame,
      title: 'Authentic Clay Tandoor',
      desc: 'Marinated in fresh hung curd & whole spices, slow-cooked in traditional clay tandoors',
    },
    {
      icon: Users,
      title: 'AC Family Cabins',
      desc: 'Dedicated private booths for family privacy, kitty parties & birthday feasts',
    },
    {
      icon: Star,
      title: 'Loved by 2,100+ Families',
      desc: '4.8 rating across city for unmatched Mughlai gravies and warm hospitality',
    },
    {
      icon: Bike,
      title: 'Piping Hot Home Delivery',
      desc: 'Spill-proof royal insulated packaging delivered in 35–45 mins. Free above ₹499',
    },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
          <Crown className="w-3.5 h-3.5 text-amber-700" />
          <span>The Darbar Fine Dining Standard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Why Choose Darbar
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          "अच्छा खाना... बेहतर माहौल... यहीं है दरबार" — Good food, great vibes, always
        </p>
      </div>

      {/* 4-Item Container */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`pt-4 sm:pt-0 ${idx > 0 ? 'sm:pl-6' : ''} space-y-2`}>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 mb-3 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

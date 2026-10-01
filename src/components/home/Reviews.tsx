import React from 'react';
import { Star, CheckCircle, Users } from 'lucide-react';

export const Reviews: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      review: 'We booked the AC Private Family Cabin for my father’s 65th birthday dinner. The Butter Chicken, Dal Makhani, and Garlic Naan were magnificent. Spotless ambiance, royal hospitality!',
      author: 'Rajesh Kapoor & Family',
      tag: 'Private Cabin Guest',
    },
    {
      stars: 5,
      review: 'Best fine dining restaurant in the area for family dinners. Their online ordering is remarkably fast too — the Dum Biryani arrived steaming hot in premium sealed packaging.',
      author: 'Dr. Sneha Iyer',
      tag: 'Family Dinner Regular',
    },
    {
      stars: 5,
      review: 'Darbar has both: wonderful fine dining downstairs for family feasts, and great cafe vibes with Wi-Fi on the upper deck. The Paneer Tikka and cold coffee are 10/10.',
      author: 'Rohit Yadav & Group',
      tag: 'Dine-In Regular',
    },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Guest Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            What Our Guests Say
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Verified experiences from families and diners at Darbar
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 self-start sm:self-auto">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>4.8 / 5 Rating (2,100+ Reviews)</span>
        </div>
      </div>

      {/* 3 Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-amber-300 transition-all space-y-4"
          >
            <div className="space-y-3">
              {/* Star Rating & Tag */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < r.stars ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {r.tag}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{r.review}"
              </p>
            </div>

            {/* Author */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="font-bold text-stone-900 text-xs">
                {r.author}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Verified Diner</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

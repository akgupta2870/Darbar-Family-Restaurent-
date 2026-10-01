import React, { useState } from 'react';
import { Clock, Star, Sparkles, Tag, Bike, Crown, Users, ArrowRight, Calendar, UtensilsCrossed } from 'lucide-react';
import { darbarInteriorImg, darbarFeastImg, butterChickenImg } from '../../data/mockData';
import { ReservationModal } from './ReservationModal';

interface HeroProps {
  onOrderNow: () => void;
  onViewMenu: () => void;
  onSeeAllOffers: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onViewMenu, onSeeAllOffers }) => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  return (
    <div className="relative">
      {/* Light-Themed Fine Dining Family Restaurant Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#f5eee2] text-stone-900 pt-10 pb-16 lg:py-16 border-b border-amber-200/50">
        {/* Subtle Warm Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Branding, Title, Tagline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Royal Heritage Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold tracking-wide shadow-2xs">
                <Crown className="w-4 h-4 text-amber-700 fill-amber-500/20" />
                <span>Fine Dining Family Restaurant & Cafe</span>
              </div>

              {/* Hindi Motto from Actual Restaurant Banner */}
              <div className="text-amber-800 font-serif italic text-sm sm:text-base tracking-wide font-medium">
                "अच्छा खाना... बेहतर माहौल... यहीं है दरबार"
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-900 leading-[1.12]">
                Your Favourite Food, <br className="hidden sm:inline" />
                <span className="text-amber-700">Just a Click Away</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-stone-600 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Freshly prepared. Delivered to your doorstep — or reserve your table for an authentic royal dining experience with family and friends.
              </p>

              {/* Action Buttons: Order Now + View Menu + Book Table */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onOrderNow}
                  className="px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Order Online Now</span>
                </button>

                <button
                  onClick={onViewMenu}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm transition-all shadow-2xs cursor-pointer hover:border-amber-300"
                >
                  View Menu
                </button>

                <button
                  onClick={() => setIsReservationOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-amber-50/90 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-sm transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Reserve Table / Cabin</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>35–45 min delivery</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Bike className="w-4 h-4 text-amber-600" />
                  <span>Free above ₹499</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>4.8 · 2,100+ family diners</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>AC Family Cabins</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Fine Dining Card & Food Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Luxury Dining Hall Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-[4/3] group">
                  <img
                    src={darbarInteriorImg}
                    alt="Darbar Fine Dining Family Restaurant Interior"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wider mb-1">
                      Royal Ambiance
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg drop-shadow-sm">
                      AC Private Family Cabins & Grand Hall
                    </h3>
                  </div>
                </div>

                {/* Floating Dish Badge Card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-amber-200 shadow-xl flex items-center gap-3 max-w-[240px]">
                  <img
                    src={butterChickenImg}
                    alt="Bestseller Butter Chicken"
                    className="w-12 h-12 rounded-xl object-cover border border-amber-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      Chef's Bestseller
                    </div>
                    <div className="text-xs font-bold text-stone-900 leading-snug">
                      Murgh Makhani & Naan
                    </div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">
                      ₹320
                    </div>
                  </div>
                </div>

                {/* Floating Tagline Badge */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 border border-amber-200 shadow-lg text-right hidden sm:block">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    Your Style...
                  </div>
                  <div className="text-xs font-serif font-bold text-amber-900">
                    Our Priority...
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Light Promotional Banner Strip */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white/95 backdrop-blur-md border border-amber-200/90 text-stone-900 rounded-2xl p-4 sm:px-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2 justify-center sm:justify-start">
                <span>20% OFF on your first order</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                  Welcome Offer
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Use code <span className="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">DARBAR20</span> at checkout · Min order ₹299
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onSeeAllOffers}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>See all offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table & Cabin Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </div>
  );
};

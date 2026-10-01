import React, { useState } from 'react';
import { Sparkles, Users, Award, BookOpen, UtensilsCrossed, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { darbarInteriorImg, darbarFeastImg, butterChickenImg, biryaniImg } from '../../data/mockData';
import { ReservationModal } from './ReservationModal';

export const StorySection: React.FC = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Royal Heritage & Fine Family Dining</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
          "अच्छा खाना... बेहतर माहौल... यहीं है दरबार"
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
          <strong className="text-stone-900 font-semibold">Your Style... Our Priority.</strong> Designed with warmth and elegance for families, friends, and discerning food lovers. Experience the royal ambiance of Darbar — from private air-conditioned family cabins to celebratory party halls and lightning-fast home delivery.
        </p>
      </div>

      {/* Visual Ambiance Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 rounded-3xl overflow-hidden border border-amber-200 shadow-xl relative aspect-[16/10] bg-stone-100 group">
          <img
            src={darbarInteriorImg}
            alt="Darbar Fine Dining Family Restaurant & Royal Interior"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Darbar Fine Dining & Cafe
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Luxury Seating, Private Cabins & Royal Ambiance
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md">
              Open 7 Days
            </div>
          </div>
        </div>

        {/* Fine Dining Features List */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span>Air-Conditioned Private Family Cabins</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-10">
              Spacious and cozy private booths tailored for memorable family dinners, elders' comfort, and private conversations away from the main rush.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span>Kitty Parties, Birthdays & Celebrations</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-10">
              Complete party arrangements, celebratory balloon decor, banquet thalis, and custom cake-cutting setups for milestone birthdays and anniversaries.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2 hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span>Authentic Clay Tandoor & Mughlai Mastery</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pl-10">
              Zero compromises on authenticity. Slow-simmered handi gravies, marinated tandoor sizzlers, and long-grain aged basmati dum biryanis cooked fresh daily.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => setIsReservationOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table / Cabin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feast Highlight Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-200/70 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              Chef's Royal Feast
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              Enjoy the Royal Darbar Dining Spread at Home
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every dish that makes Darbar a beloved dining destination is packed with multi-layered insulated containers to ensure it arrives at your table steaming hot, just like inside our dining hall.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Spill-proof royal packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Direct restaurant pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Live WhatsApp status updates</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pure veg & non-veg options</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3] bg-stone-100">
            <img
              src={darbarFeastImg}
              alt="Darbar Royal Feast Spread"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </div>
  );
};

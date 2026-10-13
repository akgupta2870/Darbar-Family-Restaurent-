import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Crown, Heart } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { NotificationService } from '../../services/notificationService';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { restaurantSettings } = useOrder();
  const whatsappUrl = NotificationService.generateWhatsAppOrderUrl(restaurantSettings.whatsappNumber);

  return (
    <footer className="bg-[#f5efe4] text-stone-700 text-xs mt-16 pb-20 md:pb-8 border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start">
          {/* Brand Column */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Crown className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 tracking-wide">
                DARBAR
              </h3>
            </div>
            <div className="text-[10px] tracking-[0.16em] font-bold text-amber-800 uppercase">
              Fine Dining & Family Restaurant
            </div>
            <p className="text-xs text-stone-600 pt-1 leading-relaxed">
              "अच्छा खाना... बेहतर माहौल... यहीं है दरबार" — Your Style... Our Priority.
            </p>
          </div>

          {/* Amenities & Experience */}
          <div className="space-y-2.5">
            <div className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Family & Dining Amenities
            </div>
            <ul className="space-y-1.5 text-stone-600 text-xs">
              <li>• AC Private Family Cabins</li>
              <li>• Birthday & Kitty Party Celebrations</li>
              <li>• Authentic Clay Tandoor & Mughlai</li>
              <li>• Daytime Student Study Cafe & High-Speed Wi-Fi</li>
              <li>• Pure Veg & Non-Veg Special Kitchens</li>
            </ul>
          </div>

          {/* Address & Contact */}
          <div className="space-y-2.5">
            <div className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Location & Contact
            </div>
            <div className="flex items-start gap-2 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>{restaurantSettings.address}, {restaurantSettings.city}</span>
            </div>

            <div className="flex items-center gap-2 text-stone-700">
              <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{restaurantSettings.phone}</span>
            </div>

            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 font-semibold transition-colors bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Timings */}
          <div className="space-y-2 text-stone-600">
            <div className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
              Restaurant Hours
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-800 font-medium">Mon – Thu: 10:00 AM – 11:00 PM</div>
                <div className="text-stone-800 font-medium mt-1">Fri – Sun: 9:00 AM – 12:00 AM</div>
              </div>
            </div>
            <div className="text-[11px] text-stone-500 pt-1">
              Table reservations accepted all 7 days
            </div>
          </div>
        </div>

        {/* Bottom subtle copyright */}
        <div className="pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>© {new Date().getFullYear()} Darbar Fine Dining & Family Restaurant. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="hover:text-amber-800 font-medium transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('menu')} className="hover:text-amber-800 font-medium transition-colors cursor-pointer">
              Menu
            </button>
            <button onClick={() => onNavigate('offers')} className="hover:text-amber-800 font-medium transition-colors cursor-pointer">
              Offers
            </button>
            <button onClick={() => onNavigate('story')} className="hover:text-amber-800 font-medium transition-colors cursor-pointer">
              Our Story
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

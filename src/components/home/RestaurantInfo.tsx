import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { NotificationService } from '../../services/notificationService';

export const RestaurantInfo: React.FC = () => {
  const { restaurantSettings } = useOrder();
  const whatsappUrl = NotificationService.generateWhatsAppOrderUrl(
    restaurantSettings.whatsappNumber,
    undefined,
    'Hi! I would like to reserve a table or place a food order.'
  );

  return (
    <section id="location" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header matching Screenshot */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Visit Us
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Dine in, pick up, or get it delivered
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Information Card matching Screenshot */}
        <div className="md:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div className="text-stone-700">
                Market Area, Main Road, Your City
              </div>
            </div>

            {/* Timing 1 */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-500 text-xs">Monday – Thursday</div>
                <div className="text-stone-800 font-semibold mt-0.5">10:00 AM – 11:00 PM</div>
              </div>
            </div>

            {/* Timing 2 */}
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-stone-500 text-xs">Friday – Sunday</div>
                <div className="text-stone-800 font-semibold mt-0.5">9:00 AM – 12:00 AM</div>
              </div>
            </div>

            {/* Fine Dining Family Features */}
            <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>AC Private Family Cabins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>Valet & Car Parking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>Birthday / Party Hall</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>Pure Veg & Non-Veg Kitchens</span>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Screenshot */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${restaurantSettings.phone}`}
              className="flex-1 py-2.5 px-4 rounded-md bg-[#d97706] hover:bg-[#b45309] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-stone-950" />
              <span>Call restaurant</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-md bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Map Preview Card matching Screenshot */}
        <div className="md:col-span-7 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs relative min-h-[260px]">
          <div className="relative h-full w-full bg-[#f3f1ec] overflow-hidden min-h-[260px] flex items-center justify-center">
            {/* Map Roads & Graphics */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="city-map" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d5d0c6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#city-map)" />
              <path d="M 0 80 Q 200 140 450 60 T 900 120" fill="none" stroke="#d97706" strokeWidth="4" opacity="0.6" />
              <path d="M 160 0 Q 240 180 320 350" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />
              <path d="M 50 250 L 500 50" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.5" />
            </svg>

            {/* City landmark markers */}
            <div className="absolute top-1/3 left-1/3 text-center">
              <div className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-stone-700 shadow-sm border border-stone-300">
                City Center
              </div>
            </div>

            {/* Center Darbar Pin */}
            <div className="relative group cursor-pointer text-center z-10">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg border-2 border-white mx-auto">
                <MapPin className="w-4 h-4 fill-stone-950 stroke-white" />
              </div>
              <div className="whitespace-nowrap bg-stone-900 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md mt-1 border border-stone-700">
                DARBAR FINE DINING & FAMILY RESTAURANT
              </div>
            </div>

            {/* Top Right "Open in Maps" button matching Screenshot */}
            <div className="absolute top-3 right-3 z-10">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(restaurantSettings.name + ' ' + restaurantSettings.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

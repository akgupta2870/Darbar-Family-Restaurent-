import React, { useState } from 'react';
import { Clock, MapPin, AlertCircle, Sparkles, Bike, Phone, MessageCircle } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { NotificationService } from '../../services/notificationService';
import { OrderStatus } from '../../types';

interface OrderTrackingPageProps {
  onBackToMenu: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onBackToMenu }) => {
  const { orders, activeOrder, setActiveOrder, updateOrderStatus, restaurantSettings } = useOrder();

  const [lookupId, setLookupId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentOrder = activeOrder || orders[0];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const clean = lookupId.trim().replace('#', '').toUpperCase();
    const found = orders.find((o) => o.orderId.toUpperCase() === clean || o.id.toUpperCase() === clean);
    if (found) {
      setActiveOrder(found);
      setErrorMsg('');
    } else {
      setErrorMsg(`No active order found for #${clean}. Try #DB1024`);
    }
  };

  const statusPipeline: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Received', label: 'Order Received', desc: 'Order details recorded in system' },
    { status: 'Confirmed', label: 'Restaurant Confirmed', desc: 'Kitchen acknowledged order' },
    { status: 'Preparing', label: 'Preparing Your Food', desc: 'Chef is slow-cooking your curries in tandoor' },
    { status: 'Ready', label: 'Ready for Pickup / Handover', desc: 'Packed fresh in thermal containers' },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is en route to your location' },
    { status: 'Delivered', label: 'Delivered', desc: 'Food handed over. Enjoy your Darbar feast!' },
  ];

  const getStatusIndex = (st: OrderStatus) => {
    const idx = statusPipeline.findIndex((p) => p.status === st);
    return idx >= 0 ? idx : 0;
  };

  const currentIndex = currentOrder ? getStatusIndex(currentOrder.orderStatus) : 2;

  const whatsappUrl = currentOrder
    ? NotificationService.generateWhatsAppOrderUrl(restaurantSettings.whatsappNumber, currentOrder.orderId)
    : '#';

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Search / Switcher for Demo */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Real-Time Order Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {currentOrder ? `Order #${currentOrder.orderId}` : 'Track Your Order'}
          </h1>
        </div>

        {/* Lookup bar */}
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Search #DB1024..."
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 font-mono focus:outline-none focus:border-amber-500 w-36 sm:w-44 shadow-xs"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {currentOrder ? (
        <div className="space-y-8">
          {/* Main Status & Delivery Time Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <div className="text-xs text-stone-500 font-medium">Current Order Status</div>
                <div className="text-xl sm:text-2xl font-serif font-bold text-amber-800 mt-0.5">
                  {statusPipeline[currentIndex]?.label}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  Customer: <span className="text-stone-900 font-bold">{currentOrder.customerName}</span> ({currentOrder.phone})
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-600 font-medium">Estimated Arrival</div>
                  <div className="text-base font-bold text-stone-900 font-mono">
                    {currentOrder.orderStatus === 'Delivered' ? 'Completed' : '25–35 Mins'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Vertical / Horizontal Timeline */}
            <div className="py-8">
              <div className="space-y-6 max-w-xl mx-auto">
                {statusPipeline.map((step, idx) => {
                  const isDone = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  const isPending = idx > currentIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4 relative">
                      {/* Connecting Line */}
                      {idx < statusPipeline.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-6 transition-colors ${
                            idx < currentIndex ? 'bg-amber-500' : 'bg-stone-200'
                          }`}
                        />
                      )}

                      {/* Status Circle Icon */}
                      <div className="relative z-10 shrink-0">
                        {isDone ? (
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold shadow-xs">
                            ✓
                          </div>
                        ) : isCurrent ? (
                          <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-600 text-amber-900 flex items-center justify-center text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-amber-600" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-300 text-stone-400 flex items-center justify-center text-xs">
                            ○
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-800'
                                : isDone
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isPending ? 'text-stone-400' : 'text-stone-600'
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Advance Button for Presenter */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Simulate Kitchen Progress:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {statusPipeline.map((st) => (
                  <button
                    key={st.status}
                    onClick={() => updateOrderStatus(currentOrder.orderId, st.status)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      currentOrder.orderStatus === st.status
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200'
                    }`}
                  >
                    {st.status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery GPS Map Placeholder */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-amber-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Live Delivery Map Preview
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                Phase-2 Live GPS Integration
              </span>
            </div>

            {/* Simulated Live Route Map Graphic */}
            <div className="relative h-60 w-full bg-[#f8f6f0] overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <pattern id="track-grid-light" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cfcbc4" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#track-grid-light)" />
                <path d="M 120 180 C 220 140, 340 190, 520 100" fill="none" stroke="#d97706" strokeWidth="4" strokeDasharray="6 4" />
              </svg>

              {/* Restaurant marker */}
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 text-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-600 text-amber-700 flex items-center justify-center shadow-md mx-auto">
                  🏨
                </div>
                <div className="text-[10px] text-stone-900 font-bold bg-white/90 px-2 py-0.5 rounded mt-1 border border-stone-300 shadow-xs">
                  Darbar Restaurant
                </div>
              </div>

              {/* Delivery Rider marker */}
              <div className="absolute left-1/2 top-1/3 -translate-y-1/2 text-center animate-bounce">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg mx-auto">
                  <Bike className="w-5 h-5" />
                </div>
                <div className="text-[10px] text-amber-950 font-bold bg-white/95 px-2 py-0.5 rounded mt-1 border border-amber-300 shadow-xs">
                  Rider Amit · 8 mins away
                </div>
              </div>

              {/* Customer destination marker */}
              <div className="absolute right-1/4 top-1/4 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mx-auto">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-stone-900 font-bold bg-white/90 px-2 py-0.5 rounded mt-1 border border-stone-300 shadow-xs">
                  Your Address
                </div>
              </div>

              {/* Informational overlay notice */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-stone-300 text-[11px] text-stone-700 text-center shadow-xs">
                <strong className="text-amber-800">Phase-2 Architecture Ready:</strong> Mapbox / Google Maps Geolocation SDK hooks are reserved in the codebase for plug-and-play live rider telematics.
              </div>
            </div>

            {/* Rider & Support Contact Row */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-800 text-xs">
                  AS
                </div>
                <div>
                  <div className="font-bold text-stone-900">Delivery Partner: Amit Sharma</div>
                  <div className="text-stone-500 text-[11px]">Vaccinated · Thermal bag sealed</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${restaurantSettings.phone}`}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call Kitchen</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Help</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-4 shadow-xs">
          <p className="text-stone-500 text-xs">No active orders being tracked.</p>
          <button
            onClick={onBackToMenu}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            Order Food Now
          </button>
        </div>
      )}
    </div>
  );
};

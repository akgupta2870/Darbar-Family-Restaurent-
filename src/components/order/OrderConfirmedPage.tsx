import React from 'react';
import { CheckCircle2, Clock, MapPin, MessageCircle, ArrowRight, ShoppingBag, Utensils } from 'lucide-react';
import { Order } from '../../types';
import { useOrder } from '../../context/OrderContext';
import { NotificationService } from '../../services/notificationService';

interface OrderConfirmedPageProps {
  order: Order;
  onTrackOrder: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmedPage: React.FC<OrderConfirmedPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  const { restaurantSettings } = useOrder();
  const whatsappUrl = NotificationService.generateWhatsAppOrderUrl(
    restaurantSettings.whatsappNumber,
    order.orderId
  );

  const steps = [
    { title: 'Received', done: true },
    { title: 'Confirmed', done: true },
    { title: 'Preparing', done: order.orderStatus === 'Preparing' || order.orderStatus === 'Ready' || order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered' },
    { title: 'Ready', done: order.orderStatus === 'Ready' || order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered' },
    { title: 'Out for Delivery', done: order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered' },
  ];

  return (
    <div className="py-10 md:py-16 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Top Confirmation Banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span>✓ Order Confirmed at Darbar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Thank you, {order.customerName}!
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs">
            <span className="text-stone-500">Order Number:</span>
            <span className="font-mono font-bold text-amber-700 text-sm">#{order.orderId}</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 max-w-md mx-auto flex items-center justify-center gap-3 text-xs text-stone-700">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Estimated Delivery: <strong className="text-stone-900">35–45 minutes</strong></span>
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="py-4 border-y border-stone-200">
          <div className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-4 text-center">
            Kitchen Preparation Pipeline
          </div>
          <div className="grid grid-cols-5 gap-1 relative text-center">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                    step.done
                      ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100'
                      : 'bg-stone-100 text-stone-400 border border-stone-300'
                  }`}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium leading-tight ${
                    step.done ? 'text-amber-900 font-bold' : 'text-stone-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left: Items Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              <span>Dishes Ordered ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-stone-200 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-stone-900">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    {item.selectedAddOns?.length > 0 && (
                      <div className="text-[10px] text-stone-500">
                        {item.selectedAddOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-stone-700 font-medium">₹{item.itemTotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-medium">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono text-stone-900 font-medium">{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-900 pt-1 text-sm border-t border-stone-300">
                <span>Total Amount</span>
                <span className="font-mono text-stone-950 font-bold">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Right: Delivery Info & Payment Status */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
            <div>
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Delivery Address</span>
              </h3>
              <p className="text-stone-700 leading-relaxed font-medium">
                {order.deliveryAddress || 'Self Pickup at Restaurant'}
              </p>
              {order.landmark && (
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Landmark: {order.landmark}
                </p>
              )}
              {order.pincode && (
                <p className="text-stone-500 text-[11px]">
                  Pincode: {order.pincode}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200">
              <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-1.5">
                Payment Status
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-medium">{order.paymentMethod}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs">
              💬 Real-time updates have been dispatched to WhatsApp & SMS.
            </div>
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onTrackOrder}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Track Order Real-Time</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>Continue Shopping</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Contact Restaurant</span>
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CreditCard, QrCode, Building, Banknote, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { CustomerInfo, PaymentMethod, Order } from '../../types';

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToMenu, onOrderSuccess }) => {
  const { cartItems, subtotal, deliveryFee, discountAmount, grandTotal, appliedCoupon, orderType, setOrderType } = useCart();
  const { placeOrder } = useOrder();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: 'Rahul Sharma',
    phone: '+91 98112 34567',
    email: 'rahul.sharma@example.com',
    deliveryAddress: 'Flat 402, Royal Palms Residency, Sector 18',
    landmark: 'Opposite City Mall',
    pincode: '110001',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessStep, setPaymentSuccessStep] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const order = await placeOrder(customerInfo, paymentMethod);
        setCreatedOrder(order);
        setIsProcessing(false);
        setPaymentSuccessStep(true);

        setTimeout(() => {
          onOrderSuccess(order);
        }, 1600);
      } catch (err) {
        console.error('Order placement failed:', err);
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Menu</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Complete Your Order
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Direct order with Darbar Cafe & Restaurant · Zero extra aggregator commissions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Details & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Type Toggle */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-2.5">
              Select Fulfillment Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  orderType === 'Delivery'
                    ? 'bg-amber-50 text-amber-900 border-amber-400'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900'
                }`}
              >
                🛵 Doorstep Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  orderType === 'Pickup'
                    ? 'bg-amber-50 text-amber-900 border-amber-400'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900'
                }`}
              >
                🏬 Counter Takeaway
              </button>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Mobile Number (for updates) *</label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-stone-700 block mb-1">Email Address (for receipt)</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {orderType === 'Delivery' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-stone-700 block mb-1">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })}
                      placeholder="Flat / House No., Building Name, Street..."
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Nearby Landmark</label>
                    <input
                      type="text"
                      value={customerInfo.landmark}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, landmark: e.target.value })}
                      placeholder="e.g. Near Metro / Opposite Park"
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.pincode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                      placeholder="e.g. 110001"
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">
                2. Select Payment Method
              </h2>
              <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Simulated Gateway</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {/* UPI Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-amber-50 border-amber-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-700" />
                      <span>Instant UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Fastest</span>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none font-mono flex-1"
                      />
                      <span className="text-[11px] text-stone-500 self-center">or Scan QR</span>
                    </div>
                  )}
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-amber-50 border-amber-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                  </span>
                </div>
              </label>

              {/* Net Banking Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Net Banking'
                    ? 'bg-amber-50 border-amber-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Net Banking'}
                  onChange={() => setPaymentMethod('Net Banking')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-amber-700" />
                    <span>Net Banking (All Major Indian Banks)</span>
                  </span>
                </div>
              </label>

              {/* Cash on Delivery Option */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-amber-50 border-amber-400 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-amber-700" />
                    <span>Cash on Delivery / Counter Pay</span>
                  </span>
                  <div className="text-[11px] text-stone-500 mt-0.5">Pay via cash or QR to rider upon delivery</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900">
              Order Items Summary ({cartItems.length})
            </h2>

            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1 space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-stone-900">
                      {item.quantity}x {item.menuItem.name}
                    </div>
                    {item.selectedAddOns?.length > 0 && (
                      <div className="text-[10px] text-stone-500">
                        {item.selectedAddOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-stone-900 font-bold">
                    ₹{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-semibold">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono text-stone-900 font-semibold">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>Total Payable</span>
                <span className="text-lg text-stone-950 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing || paymentSuccessStep}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment ₹{grandTotal}...</span>
                </>
              ) : paymentSuccessStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Payment Successful!</span>
                </>
              ) : (
                <span>Pay ₹{grandTotal} & Place Order</span>
              )}
            </button>

            <div className="text-[11px] text-center text-stone-500">
              🔒 256-Bit SSL Encrypted Mock Gateway · Integration Ready for Razorpay
            </div>
          </div>
        </div>
      </form>

      {/* Simulated Payment Success Modal Overlay */}
      {paymentSuccessStep && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-300 rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Transaction Approved
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                Payment Successful
              </h3>
              <p className="text-xs text-stone-600 mt-2 font-mono">
                Order #{createdOrder?.orderId || 'DB1024'} has been placed successfully with Darbar.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 text-xs text-stone-600 border border-stone-200">
              Generating your live order tracking pass...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

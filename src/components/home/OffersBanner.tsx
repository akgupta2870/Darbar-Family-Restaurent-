import React, { useState } from 'react';
import { Percent, Gift, Sparkles, Check, Copy } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';

export const OffersBanner: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { applyCoupon } = useCart();
  const { showToast } = useOrder();

  const offers = [
    {
      id: 'off-1',
      code: 'DARBAR20',
      title: '20% OFF on your first order',
      desc: 'New here? Get flat 20% off your very first Darbar order.',
      icon: Percent,
    },
    {
      id: 'off-2',
      code: 'BIRYANI2',
      title: 'Buy 2 Biryani & Get 1 Coke FREE',
      desc: 'Order any two biryanis and a chilled Coke is on us.',
      icon: Gift,
    },
    {
      id: 'off-3',
      code: 'WEEKEND100',
      title: 'Weekend Special — Flat ₹100 OFF',
      desc: 'Saturdays and Sundays: Flat ₹100 off above ₹499.',
      icon: Sparkles,
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    const res = applyCoupon(code);
    showToast(
      res.success ? 'Coupon Applied' : 'Code Copied',
      res.success ? res.message : `Code ${code} copied to clipboard!`,
      'success'
    );
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header matching Screenshot */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Current Offers
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Save more on every order
        </p>
      </div>

      {/* 3-Card Grid matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const Icon = offer.icon;
          const isCopied = copiedCode === offer.code;

          return (
            <div
              key={offer.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 mb-4">
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-base font-serif font-bold text-stone-900 mb-2">
                  {offer.title}
                </h3>

                <p className="text-xs text-stone-500 leading-relaxed mb-6">
                  {offer.desc}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold tracking-wider flex items-center justify-between border border-stone-200 transition-colors cursor-pointer"
                >
                  <span>{offer.code}</span>
                  {isCopied ? (
                    <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-sans">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="text-stone-500 flex items-center gap-1 text-[11px] font-sans">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { X, CheckCircle2, Server, FolderTree, ArrowRight, ExternalLink, Code2, Globe, Sparkles, Copy, Check } from 'lucide-react';

interface NextJsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextJsInfoModal: React.FC<NextJsInfoModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText('cp package.next.json package.json && npm install && npm run dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const routes = [
    { path: '/', type: 'App Router (Page)', file: 'app/page.tsx', desc: 'Homepage with light theme hero, today special, bestsellers, offers banner & reviews' },
    { path: '/menu', type: 'App Router (Page)', file: 'app/menu/page.tsx', desc: 'Categorized digital menu with veg/non-veg filter, search, add-ons & notes' },
    { path: '/offers', type: 'App Router (Page)', file: 'app/offers/page.tsx', desc: 'Marketing promotions and copyable coupon codes (DARBAR20, BIRYANI2, etc.)' },
    { path: '/track', type: 'App Router (Page)', file: 'app/track/page.tsx', desc: 'Real-time 6-stage order tracking with simulated WhatsApp & SMS alerts' },
    { path: '/checkout', type: 'App Router (Page)', file: 'app/checkout/page.tsx', desc: 'Delivery/pickup checkout with simulated UPI, card & COD payment flows' },
    { path: '/story', type: 'App Router (Page)', file: 'app/story/page.tsx', desc: 'Royal Darbar heritage, AC private family cabins, party halls & feast showcase' },
    { path: '/admin', type: 'App Router (Admin)', file: 'app/admin/page.tsx', desc: 'Full restaurant portal: orders, revenue, menu manager, table cabins & offers' },
    { path: '/api/orders', type: 'Route Handler (API)', file: 'app/api/orders/route.ts', desc: 'REST endpoint for order submission, customer record creation & status sync' },
    { path: '/api/reservations', type: 'Route Handler (API)', file: 'app/api/reservations/route.ts', desc: 'REST endpoint for booking AC family cabins & table seating' },
    { path: '/api/menu', type: 'Route Handler (API)', file: 'app/api/menu/route.ts', desc: 'REST endpoint serving categorized dishes, prices & add-on choices' },
    { path: '/api/webhook/whatsapp', type: 'Route Handler (API)', file: 'app/api/webhook/whatsapp/route.ts', desc: 'Meta WhatsApp Business API webhook verification & order messaging trigger' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 border-b border-stone-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center shadow-md">
              Next
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next.js 15 App Router Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Darbar Next.js 15 Implementation
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            This project contains full Next.js 15 App Router code with pages, server API route handlers, and modular components ready for immediate deployment.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Key Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>App Router v15</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Modern nested layouts, React Server Component patterns, and streaming.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-700" />
                <span>Server API Routes</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Native `/app/api/*` route handlers for orders, reservations, and WhatsApp webhooks.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-Click Deploy</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Configured with `next.config.mjs` and `package.next.json` for Vercel / Firebase.
              </p>
            </div>
          </div>

          {/* Next.js Routes Table */}
          <div className="space-y-2">
            <div className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-amber-700" />
              <span>Next.js App Router Structure & API Endpoints</span>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                {routes.map((rt) => (
                  <div key={rt.path} className="p-2.5 sm:px-3.5 hover:bg-stone-50 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-[11px] bg-stone-100 px-2 py-0.5 rounded">
                          {rt.path}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          rt.type.includes('API') ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rt.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {rt.desc}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-stone-400 shrink-0 hidden sm:inline">
                      {rt.file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick CLI Commands */}
          <div className="p-4 rounded-2xl bg-stone-900 text-stone-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Code2 className="w-3.5 h-3.5" />
                <span>Next.js Standalone Build & Run Command</span>
              </span>
              <button
                onClick={handleCopyCmd}
                className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white bg-white/10 px-2 py-0.5 rounded cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <code className="block font-mono text-[11px] text-amber-300 bg-stone-950 p-2.5 rounded-xl overflow-x-auto">
              cp package.next.json package.json && npm install && npm run dev
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

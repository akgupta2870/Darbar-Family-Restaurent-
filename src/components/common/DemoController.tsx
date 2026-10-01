import React, { useState } from 'react';
import { Presentation, ShieldCheck, ShoppingBag, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';
import { FirebaseService } from '../../services/firebaseService';

interface DemoControllerProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenNextJsInfo?: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({ currentView, onNavigate, onOpenNextJsInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { activeOrder, updateOrderStatus, refreshOrders, showToast } = useOrder();

  const isAdmin = currentView.startsWith('admin');

  const handleQuickOrderPreset = () => {
    const bc = INITIAL_MENU_ITEMS[0];
    const naan = INITIAL_MENU_ITEMS[7];
    if (bc) addToCart(bc, 1, [bc.availableAddOns?.[0]!], 'Less spicy please');
    if (naan) addToCart(naan, 2);
    setIsCartOpen(true);
    showToast('Demo Preset Loaded', 'Butter Chicken + 2 Butter Naan added to cart', 'success');
  };

  const handleNextStatus = () => {
    if (!activeOrder) {
      showToast('No Active Order', 'Place an order first to advance its status', 'info');
      return;
    }
    const flow: Array<typeof activeOrder.orderStatus> = [
      'Received',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered',
    ];
    const currentIndex = flow.indexOf(activeOrder.orderStatus);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      const next = flow[currentIndex + 1];
      updateOrderStatus(activeOrder.orderId, next);
    } else {
      showToast('Completed', 'Order is already delivered', 'info');
    }
  };

  const handleReset = () => {
    FirebaseService.resetDemoData();
    refreshOrders();
    showToast('Demo Reset', 'Sample data restored to clean state', 'success');
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 right-4 z-50">
      <div className="bg-white/95 border border-stone-300 rounded-xl shadow-2xl backdrop-blur-md text-xs text-stone-800 overflow-hidden transition-all duration-200">
        {/* Header pill */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200 gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
            <span>Pitch Demo Mode</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-900 transition-colors"
            title="Toggle Demo Tools"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Quick toggle always visible */}
        <div className="p-2 flex items-center gap-2">
          <button
            onClick={() => onNavigate(isAdmin ? 'home' : 'admin')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              isAdmin
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs'
            }`}
          >
            {isAdmin ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Switch to Customer View</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Admin Dashboard</span>
              </>
            )}
          </button>

          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="text-[11px] text-stone-500 hover:text-amber-800 underline px-1"
            >
              Controls
            </button>
          )}
        </div>

        {/* Expanded demo helper panel */}
        {isOpen && (
          <div className="p-3 pt-1 border-t border-stone-200 space-y-2 bg-stone-50">
            <p className="text-[11px] text-stone-500 leading-tight">
              Pre-configured shortcuts for presentation to restaurant owner:
            </p>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={handleQuickOrderPreset}
                className="w-full text-left px-2.5 py-1.5 rounded bg-white hover:bg-amber-50 text-amber-900 border border-stone-200 font-semibold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>1. Load 1-Click Cart Preset</span>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              </button>

              <button
                onClick={() => onNavigate('track')}
                className="w-full text-left px-2.5 py-1.5 rounded bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-semibold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>2. View Live Order Tracking</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>

              {activeOrder && (
                <button
                  onClick={handleNextStatus}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold flex items-center justify-between border border-amber-300 transition-colors"
                >
                  <span>Advance Status ({activeOrder.orderStatus} → Next)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenNextJsInfo && (
                <button
                  onClick={onOpenNextJsInfo}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold flex items-center justify-between transition-colors shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] bg-amber-400 text-stone-950 px-1 py-0.2 rounded font-black">Next</span>
                    <span>Next.js 15 App Router Code</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleReset}
                className="w-full text-left px-2.5 py-1.5 rounded bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-[11px] flex items-center justify-between border border-stone-200 transition-colors"
              >
                <span>Reset Demo Database</span>
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

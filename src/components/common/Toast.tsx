import React from 'react';
import { CheckCircle2, MessageCircle, MessageSquare, X, Info } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useOrder();

  if (!toast) return null;

  const isWhatsApp = toast.type === 'whatsapp';
  const isSMS = toast.type === 'sms';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-200">
      <div
        className={`p-3.5 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-xl ${
          isWhatsApp
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : isSMS
            ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
            : isSuccess
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-white border-stone-300 text-stone-900'
        }`}
      >
        <div className="p-1 rounded-lg shrink-0 mt-0.5">
          {isWhatsApp && <MessageCircle className="w-5 h-5 text-emerald-600" />}
          {isSMS && <MessageSquare className="w-5 h-5 text-indigo-600" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
          {!isWhatsApp && !isSMS && !isSuccess && <Info className="w-5 h-5 text-sky-600" />}
        </div>

        <div className="flex-1 text-xs min-w-0 pr-1">
          <div className="font-semibold text-stone-900 mb-0.5 flex items-center justify-between">
            <span className="truncate">{toast.title}</span>
            <span className="text-[10px] text-stone-500 font-normal ml-2">Simulated</span>
          </div>
          <p className="leading-relaxed text-stone-700 break-words">{toast.message}</p>
        </div>

        <button
          onClick={clearToast}
          aria-label="Dismiss notification"
          className="text-stone-400 hover:text-stone-900 shrink-0 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

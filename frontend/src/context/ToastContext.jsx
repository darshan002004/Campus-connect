import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-900',
          icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-300 text-blue-900',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform translate-y-0 opacity-100 ${style.bg}`}
            >
              {style.icon}
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

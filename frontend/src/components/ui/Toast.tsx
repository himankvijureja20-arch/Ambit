import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const styles: Record<ToastType, string> = {
    success: 'bg-navy-900 text-white border-success/40',
    error:   'bg-danger text-white border-danger/40',
    info:    'bg-navy-900 text-white border-primary/40',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-full border shadow-raised text-sm font-semibold max-w-xs transition-all duration-300 pointer-events-auto
        ${styles[toast.type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="text-base leading-none">{icons[toast.type]}</span>
      {toast.message}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

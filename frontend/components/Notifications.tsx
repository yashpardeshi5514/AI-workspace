'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const bgColors = {
  success: 'bg-green-900/20 border-green-700',
  error: 'bg-red-900/20 border-red-700',
  warning: 'bg-yellow-900/20 border-yellow-700',
  info: 'bg-blue-900/20 border-blue-700',
};

const textColors = {
  success: 'text-green-200',
  error: 'text-red-200',
  warning: 'text-yellow-200',
  info: 'text-blue-200',
};

export function Notification({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose?.(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[type]}`}>
      {icons[type]}
      <p className={`flex-1 text-sm ${textColors[type]}`}>{message}</p>
      <button
        onClick={() => onClose?.(id)}
        className="text-zinc-400 hover:text-zinc-300 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function NotificationContainer({
  notifications,
  onClose,
}: {
  notifications: Array<NotificationProps & { id: string }>;
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50 max-w-md">
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          {...notif}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<
    Array<NotificationProps & { id: string }>
  >([]);

  const add = (type: NotificationType, message: string, duration?: number) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    return id;
  };

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (message: string) => add('success', message);
  const error = (message: string) => add('error', message, 6000);
  const warning = (message: string) => add('warning', message);
  const info = (message: string) => add('info', message);

  return { notifications, add, remove, success, error, warning, info };
}

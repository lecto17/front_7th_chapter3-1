import { useState, useCallback } from 'react';

interface Notification {
  type: 'success' | 'error' | null;
  message: string;
}

interface UseNotificationReturn {
  notification: Notification;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  dismiss: () => void;
}

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<Notification>({
    type: null,
    message: '',
  });

  const showSuccess = useCallback((message: string) => {
    setNotification({ type: 'success', message });
  }, []);

  const showError = useCallback((message: string) => {
    setNotification({ type: 'error', message });
  }, []);

  const dismiss = useCallback(() => {
    setNotification({ type: null, message: '' });
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    dismiss,
  };
}

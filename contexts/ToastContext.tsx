import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomToast from '@/components/Toast';

interface ToastContextProps {
  showToast: (message: string, type: "success" | "error" | "info" | "loading") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "loading"; show: boolean }>({
    message: '',
    type: 'info',
    show: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info" | "loading") => {
    setToast({ message, type, show: true });
  };

  const handleClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};

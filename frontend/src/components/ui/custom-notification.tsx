"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const CustomNotification: React.FC<CustomNotificationProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    const iconColor = "text-white"; // Always white for good contrast on colored backgrounds
    switch (type) {
      case 'success':
        return <CheckCircle className={`w-6 h-6 ${iconColor}`} />;
      case 'error':
        return <X className={`w-6 h-6 ${iconColor}`} />;
      case 'info':
        return <Mail className={`w-6 h-6 ${iconColor}`} />;
      default:
        return <CheckCircle className={`w-6 h-6 ${iconColor}`} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#17726E] border border-[#17726E]/20'; // Solid teal
      case 'error':
        return 'bg-red-600 border border-red-600/20'; // Solid red
      case 'info':
        return 'bg-[#DF9C49] border border-[#DF9C49]/20'; // Solid gold
      default:
        return 'bg-[#DF9C49] border border-[#DF9C49]/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-white'; // White text on teal
      case 'error':
        return 'text-white'; // White text on red
      case 'info':
        return 'text-white'; // White text on gold
      default:
        return 'text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md">
      <div
        className={cn(
          "flex items-center space-x-3 p-4 rounded-xl shadow-lg",
          "transform transition-all duration-300 ease-out",
          getBackgroundColor(),
          isVisible 
            ? "translate-x-0 opacity-100 scale-100" 
            : "translate-x-full opacity-0 scale-95"
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className={cn("font-medium text-sm leading-relaxed", getTextColor())}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

// Hook for managing notification state
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const NotificationComponent = () => (
    <CustomNotification
      message={notification.message}
      type={notification.type}
      isVisible={notification.isVisible}
      onClose={hideNotification}
    />
  );

  return {
    showNotification,
    hideNotification,
    NotificationComponent
  };
};

export default CustomNotification;
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle size={16} color="#4ade80" />;
      case 'warning':
        return <AlertTriangle size={16} color="#fbbf24" />;
      case 'error':
        return <AlertCircle size={16} color="#f87171" />;
      default:
        return <Info size={16} color="#93c5fd" />;
    }
  };

  return (
    <div className={`toast-banner ${toastMessage.type}`}>
      {getIcon()}
      <span>{toastMessage.text}</span>
    </div>
  );
};

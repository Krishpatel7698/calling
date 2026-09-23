import React from 'react';
import { useCustomers } from '../context/CustomerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, closeToast } = useCustomers();

  if (!toast) return null;

  const Icon = 
    toast.type === 'error' ? AlertCircle :
    toast.type === 'info' ? Info :
    CheckCircle2;

  const toastClass = 
    toast.type === 'error' ? 'toast-error' :
    toast.type === 'info' ? 'toast-info' :
    'toast-success';

  return (
    <div className="toast-container">
      <div className={`toast ${toastClass}`} role="status">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Icon size={19} style={{ flexShrink: 0 }} />
          <span>{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={closeToast}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

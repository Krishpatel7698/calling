import React from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  Bell, 
  X, 
  Phone, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  FileText,
  ChevronRight
} from 'lucide-react';

export const NotificationsDrawer = ({ setActivePage, onViewDetails }) => {
  const { 
    notifications, 
    notificationDrawerOpen, 
    setNotificationDrawerOpen,
    customers,
    tasks
  } = useCustomers();

  if (!notificationDrawerOpen) return null;

  const handleNotificationClick = (item) => {
    setNotificationDrawerOpen(false);
    if (item.type === 'follow-up' && item.customerId) {
      const cust = customers.find((c) => c.id === item.customerId);
      if (cust && onViewDetails) {
        onViewDetails(cust);
      } else {
        setActivePage('customers');
      }
    } else if (item.type === 'task') {
      setActivePage('tasks');
    } else if (item.type === 'payment' || item.type === 'quotation') {
      setActivePage('quotations');
    }
  };

  return (
    <div 
      className="notification-drawer-backdrop" 
      onClick={() => setNotificationDrawerOpen(false)}
    >
      <div 
        className="notification-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Notifications & Alerts</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {notifications.length} pending action items
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-icon btn-secondary btn-sm" 
            onClick={() => setNotificationDrawerOpen(false)}
            aria-label="Close notifications"
          >
            <X size={17} />
          </button>
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <div 
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle size={26} />
              </div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>All Caught Up!</h4>
              <p style={{ fontSize: '0.85rem' }}>No pending follow-ups or overdue tasks right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((item) => {
                const isFollowUp = item.type === 'follow-up';
                const isTask = item.type === 'task';
                const isPayment = item.type === 'payment';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div 
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        backgroundColor: isFollowUp 
                          ? 'rgba(251, 191, 36, 0.15)' 
                          : isPayment 
                          ? 'rgba(239, 68, 68, 0.15)' 
                          : 'rgba(59, 130, 246, 0.15)',
                        color: isFollowUp ? '#fbbf24' : isPayment ? '#f87171' : '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2
                      }}
                    >
                      {isFollowUp ? <Phone size={16} /> : isPayment ? <DollarSign size={16} /> : <Clock size={16} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {item.message}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        <span>Scheduled: {item.time}</span>
                      </div>
                    </div>

                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', alignSelf: 'center' }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time CRM Reminders
          </span>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => setNotificationDrawerOpen(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

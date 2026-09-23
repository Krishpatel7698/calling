import React from 'react';
import { LayoutDashboard, Users, UserPlus, Settings } from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

export const MobileBottomNav = ({ activePage, setActivePage }) => {
  const { stats } = useCustomers();

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: stats.total },
    { id: 'add-customer', label: 'Add Lead', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            id={`mobile-tab-${item.id}`}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={21} />
              {item.badge !== undefined && item.badge > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    borderRadius: '50%',
                    minWidth: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

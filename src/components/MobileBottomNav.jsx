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
        const isAction = item.id === 'add-customer';

        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${isAction ? 'mobile-nav-action-btn' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            id={`mobile-tab-${item.id}`}
            aria-label={item.label}
          >
            <div className="mobile-nav-icon-wrap">
              <Icon size={isAction ? 20 : 21} strokeWidth={isAction ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="mobile-nav-badge">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

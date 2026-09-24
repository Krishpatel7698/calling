import React from 'react';
import { LayoutDashboard, Users, TrendingUp, CheckSquare, FileText } from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

export const MobileBottomNav = ({ activePage, setActivePage }) => {
  const { stats, tasks, quotations } = useCustomers();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Leads', icon: Users, badge: stats.total },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: tasks.filter((t) => t.status !== 'Completed').length },
    { id: 'quotations', label: 'Bills', icon: FileText }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            style={{ position: 'relative' }}
          >
            <Icon size={20} />
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: 2,
                  right: '25%',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.05rem 0.35rem',
                  borderRadius: '9999px'
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

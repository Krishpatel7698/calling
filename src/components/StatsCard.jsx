import React from 'react';

export const StatsCard = ({ title, count, icon: Icon, type = 'total', subtitle }) => {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div 
          className="stat-icon-wrapper"
          style={{
            backgroundColor: 
              type === 'total' ? 'rgba(59, 130, 246, 0.15)' :
              type === 'new' ? 'rgba(56, 189, 248, 0.15)' :
              type === 'called' ? 'rgba(251, 191, 36, 0.15)' :
              type === 'interested' ? 'rgba(192, 132, 252, 0.15)' :
              type === 'call-later' ? 'rgba(251, 146, 60, 0.15)' :
              'rgba(52, 211, 153, 0.15)',
            color:
              type === 'total' ? '#3b82f6' :
              type === 'new' ? '#38bdf8' :
              type === 'called' ? '#fbbf24' :
              type === 'interested' ? '#c084fc' :
              type === 'call-later' ? '#fb923c' :
              '#34d399'
          }}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="stat-value">{count}</div>

      {subtitle && (
        <div className="stat-footer">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

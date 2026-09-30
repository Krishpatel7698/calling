import React from 'react';
import { Smartphone, Globe, Briefcase, Cpu, CheckCircle2, XCircle } from 'lucide-react';

export const ProjectBadge = ({ hasProject }) => {
  if (hasProject) {
    return (
      <span 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(52, 211, 153, 0.35)'
        }}
      >
        <CheckCircle2 size={13} />
        Project: Yes
      </span>
    );
  }

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: 'rgba(148, 163, 184, 0.12)',
        color: '#94a3b8',
        border: '1px solid rgba(148, 163, 184, 0.25)'
      }}
    >
      <XCircle size={13} />
      Project: No
    </span>
  );
};

export const ProjectTypeBadge = ({ type }) => {
  if (!type) {
    return (
      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
        No Project
      </span>
    );
  }

  const config = {
    'Mobile App': {
      icon: Smartphone,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.14)',
      border: 'rgba(56, 189, 248, 0.35)'
    },
    'Website': {
      icon: Globe,
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.14)',
      border: 'rgba(192, 132, 252, 0.35)'
    },
    'CRM': {
      icon: Briefcase,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.14)',
      border: 'rgba(251, 191, 36, 0.35)'
    },
    'ERP': {
      icon: Cpu,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.14)',
      border: 'rgba(244, 63, 94, 0.35)'
    }
  }[type] || {
    icon: Globe,
    color: '#60a5fa',
    bg: 'rgba(59, 130, 246, 0.14)',
    border: 'rgba(59, 130, 246, 0.35)'
  };

  const Icon = config.icon;

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.7rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      <Icon size={13} />
      {type}
    </span>
  );
};

export const StatusBadge = ProjectBadge;
export default ProjectBadge;

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
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid var(--success-border)'
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
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)'
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
      color: '#111111',
      bg: '#F7F7F7',
      border: '#E5E5E5'
    },
    'Website': {
      icon: Globe,
      color: '#111111',
      bg: '#F7F7F7',
      border: '#E5E5E5'
    },
    'CRM': {
      icon: Briefcase,
      color: '#111111',
      bg: '#F7F7F7',
      border: '#E5E5E5'
    },
    'ERP': {
      icon: Cpu,
      color: '#111111',
      bg: '#F7F7F7',
      border: '#E5E5E5'
    }
  }[type] || {
    icon: Globe,
    color: '#111111',
    bg: '#F7F7F7',
    border: '#E5E5E5'
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

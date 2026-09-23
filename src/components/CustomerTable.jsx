import React from 'react';
import { ProjectBadge, ProjectTypeBadge } from './StatusBadge';
import { useCustomers } from '../context/CustomerContext';
import { Phone, MessageCircle, Edit, Trash2, Building2, User } from 'lucide-react';

export const CustomerTable = ({ customers, onViewDetails }) => {
  const { openEditModal, deleteCustomer } = useCustomers();

  return (
    <div 
      style={{
        overflowX: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <th style={{ padding: '1rem 1.25rem' }}>Company Name</th>
            <th style={{ padding: '1rem 1.25rem' }}>Customer Name</th>
            <th style={{ padding: '1rem 1.25rem' }}>Phone Number</th>
            <th style={{ padding: '1rem 1.25rem' }}>Project?</th>
            <th style={{ padding: '1rem 1.25rem' }}>Project Type</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const cleanPhone = (c.phone || '').replace(/[^0-9+]/g, '');

            return (
              <tr 
                key={c.id} 
                style={{ 
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                {/* 1. Company Name */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div 
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: c.hasProject ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.hasProject ? '#60a5fa' : 'var(--text-tertiary)',
                        flexShrink: 0
                      }}
                    >
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {c.companyName || 'Unnamed Company'}
                      </div>
                      {c.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Customer Name */}
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span>{c.customerName || c.name}</span>
                  </div>
                </td>

                {/* 3. Phone Number */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <a
                    href={`tel:${cleanPhone}`}
                    style={{
                      color: '#38bdf8',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                    title="Click to dial"
                  >
                    <Phone size={13} style={{ color: '#10b981' }} />
                    {c.phone}
                  </a>
                </td>

                {/* 4. Project Yes/No */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <ProjectBadge hasProject={c.hasProject} />
                </td>

                {/* 5. Project Type */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <ProjectTypeBadge type={c.projectType} />
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    {/* Direct Call button */}
                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn btn-call btn-sm"
                      title="Call Customer"
                    >
                      <Phone size={14} /> Call
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm btn-icon"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </a>

                    {/* Edit */}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => openEditModal(c)}
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => {
                        if (window.confirm(`Delete inquiry for "${c.companyName || c.customerName}"?`)) {
                          deleteCustomer(c.id, c.companyName || c.customerName);
                        }
                      }}
                      style={{ color: '#f87171' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

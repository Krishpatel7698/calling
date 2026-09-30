import React, { useState } from 'react';
import { ProjectBadge, ProjectTypeBadge } from './StatusBadge';
import { useCustomers } from '../context/CustomerContext';
import { 
  Building2, 
  User, 
  Phone, 
  Edit, 
  Trash2, 
  Calendar,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const CustomerCard = ({ customer, onViewDetails }) => {
  const { initiateCall, openEditModal, deleteCustomer } = useCustomers();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');
  const companyInitial = (customer.companyName || customer.customerName || 'C')[0].toUpperCase();

  const formattedDate = customer.createdAt || customer.dateAdded
    ? new Date(customer.createdAt || customer.dateAdded).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`;

  return (
    <div className="customer-card">
      {/* Header: Company Name & Badges */}
      <div className="customer-card-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', overflow: 'hidden' }}>
          <div 
            className="avatar-circle"
            style={{
              background: customer.hasProject 
                ? 'linear-gradient(135deg, #1e3a8a, #1d4ed8)' 
                : 'linear-gradient(135deg, #334155, #475569)',
              color: '#ffffff'
            }}
          >
            {companyInitial}
          </div>
          <div style={{ overflow: 'hidden' }}>
            {/* 1. Company Name */}
            <h4 
              className="customer-name" 
              style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}
              title={customer.companyName}
            >
              {customer.companyName || 'Unnamed Company'}
            </h4>

            {/* 2. Customer Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <User size={13} style={{ color: 'var(--text-tertiary)' }} />
              <span>{customer.customerName || customer.name}</span>
            </div>
          </div>
        </div>

        {/* 4 & 5. Project Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <ProjectBadge hasProject={customer.hasProject} />
          {customer.hasProject && customer.projectType && (
            <ProjectTypeBadge type={customer.projectType} />
          )}
        </div>
      </div>

      {/* 3. Phone Number */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <a 
          href={`tel:${cleanPhone}`} 
          className="customer-phone-link"
          style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8' }}
        >
          <Phone size={14} style={{ color: '#10b981' }} />
          <span>{customer.phone}</span>
        </a>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
          {formattedDate}
        </span>
      </div>

      {/* Notes if any */}
      {customer.notes && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--primary)' }}>
          {customer.notes}
        </div>
      )}

      {/* Delete Confirmation Warning */}
      {showDeleteConfirm ? (
        <div 
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
            Delete inquiry for <strong>{customer.companyName || customer.customerName}</strong>?
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                deleteCustomer(customer.id, customer.companyName || customer.customerName);
                setShowDeleteConfirm(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons Row */
        <div className="customer-actions-row">
          {/* Main Call Customer Button: Direct tel: dialer */}
          <a
            href={`tel:${cleanPhone}`}
            className="btn btn-call btn-mobile-call"
            id={`call-btn-${customer.id}`}
            title={`Call ${customer.phone}`}
          >
            <Phone size={17} />
            <span>Call Customer</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm btn-icon"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={16} />
          </a>

          {/* Edit Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => openEditModal(customer)}
            title="Edit Inquiry"
            id={`edit-btn-${customer.id}`}
          >
            <Edit size={16} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => setShowDeleteConfirm(true)}
            style={{ color: '#f87171' }}
            title="Delete Inquiry"
            id={`delete-btn-${customer.id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

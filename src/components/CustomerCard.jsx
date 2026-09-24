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
  ExternalLink,
  DollarSign,
  Clock
} from 'lucide-react';

export const CustomerCard = ({ customer, onViewDetails }) => {
  const { initiateCall, openEditModal, deleteCustomer, openCallModal, companySettings } = useCustomers();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');
  const companyInitial = (customer.companyName || customer.customerName || 'C')[0].toUpperCase();
  const currency = companySettings.currency || '₹';

  const formattedDate = customer.createdAt || customer.dateAdded
    ? new Date(customer.createdAt || customer.dateAdded).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hello ${customer.customerName || ''}, greeting from ${companySettings.companyName}!`)}`;

  return (
    <div className="customer-card">
      {/* Header: Company Name & Badges */}
      <div className="customer-card-header">
        <div 
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', overflow: 'hidden', cursor: 'pointer', flex: 1 }}
          onClick={() => onViewDetails && onViewDetails(customer)}
        >
          <div 
            className="avatar-circle"
            style={{
              backgroundColor: '#111111',
              color: '#ffffff'
            }}
          >
            {companyInitial}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 
              className="customer-name" 
              style={{ fontSize: '1.05rem', marginBottom: '0.15rem', color: 'var(--text-primary)' }}
              title={customer.companyName}
            >
              {customer.companyName || 'Unnamed Company'}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <User size={13} style={{ color: 'var(--text-tertiary)' }} />
              <span>{customer.customerName || customer.name}</span>
            </div>
          </div>
        </div>

        {/* Stage & Project Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
          <span 
            className="status-badge"
            style={{
              backgroundColor: customer.leadStatus === 'Won' 
                ? 'var(--success-bg)' 
                : customer.leadStatus === 'Lost' 
                  ? 'var(--danger-bg)' 
                  : 'var(--bg-surface)',
              color: customer.leadStatus === 'Won' 
                ? 'var(--success)' 
                : customer.leadStatus === 'Lost' 
                  ? 'var(--danger)' 
                  : 'var(--text-primary)',
              borderColor: customer.leadStatus === 'Won' 
                ? 'var(--success-border)' 
                : customer.leadStatus === 'Lost' 
                  ? 'var(--danger-border)' 
                  : 'var(--border-subtle)',
              fontSize: '0.72rem'
            }}
          >
            {customer.leadStatus || customer.status}
          </span>
          {customer.hasProject && customer.projectType && (
            <ProjectTypeBadge type={customer.projectType} />
          )}
        </div>
      </div>

      {/* Highlights Bar: Deal Value & Follow-up */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '0.55rem 0.85rem',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ color: 'var(--text-tertiary)' }}>Value:</span>
          <strong style={{ color: 'var(--success)', fontFamily: 'monospace' }}>
            {currency}{Number(customer.dealValue || 0).toLocaleString()}
          </strong>
        </div>

        {customer.followUpDate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', fontSize: '0.75rem', fontWeight: 600 }}>
            <Clock size={12} />
            <span>Follow-up: {customer.followUpDate}</span>
          </div>
        ) : (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
            Added: {formattedDate}
          </span>
        )}
      </div>

      {/* Notes preview if any */}
      {customer.notes && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', backgroundColor: '#FFFFFF', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid #111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {customer.notes}
        </div>
      )}

      {/* Delete Confirmation Warning */}
      {showDeleteConfirm ? (
        <div 
          style={{
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
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
          {/* Main Call Customer Button */}
          <a
            href={`tel:${cleanPhone}`}
            className="btn btn-call btn-mobile-call"
            id={`call-btn-${customer.id}`}
            title={`Call ${customer.phone}`}
            onClick={() => openCallModal(customer)}
          >
            <Phone size={16} />
            <span>{customer.phone}</span>
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

          {/* View Details */}
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => onViewDetails && onViewDetails(customer)}
            title="View Full Profile"
          >
            <ExternalLink size={15} />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-icon"
            onClick={() => openEditModal(customer)}
            title="Edit Inquiry"
            id={`edit-btn-${customer.id}`}
          >
            <Edit size={15} />
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
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

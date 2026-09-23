import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { ProjectBadge, ProjectTypeBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Edit, 
  Trash2, 
  Building2, 
  User, 
  Calendar,
  Layers,
  Send
} from 'lucide-react';

export const CustomerDetails = ({ customerId, setActivePage }) => {
  const { customers, openEditModal, deleteCustomer, updateCustomer } = useCustomers();
  const [newQuickNote, setNewQuickNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3>Inquiry not found</h3>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setActivePage('customers')}
          style={{ marginTop: '1rem' }}
        >
          Back to Inquiry List
        </button>
      </div>
    );
  }

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');
  const companyInitial = (customer.companyName || customer.customerName || 'C')[0].toUpperCase();

  const formattedDate = customer.createdAt || customer.dateAdded
    ? new Date(customer.createdAt || customer.dateAdded).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newQuickNote.trim()) return;

    setIsSavingNote(true);
    const existing = customer.notes || '';
    const timestamp = new Date().toLocaleDateString();
    const updatedNotes = existing 
      ? `${existing}\n[Note ${timestamp}]: ${newQuickNote.trim()}`
      : newQuickNote.trim();

    await updateCustomer(customer.id, { notes: updatedNotes });
    setNewQuickNote('');
    setIsSavingNote(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setActivePage('customers')}
        >
          <ArrowLeft size={16} /> Back to Inquiries
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openEditModal(customer)}
          >
            <Edit size={15} /> Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Delete inquiry for ${customer.companyName || customer.customerName}?`)) {
                deleteCustomer(customer.id, customer.companyName || customer.customerName);
                setActivePage('customers');
              }
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{
                width: 60,
                height: 60,
                borderRadius: 'var(--radius-md)',
                background: customer.hasProject 
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                  : 'linear-gradient(135deg, #475569, #334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'white',
                flexShrink: 0
              }}
            >
              {companyInitial}
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {customer.companyName || 'Unnamed Company'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <User size={15} />
                <span>{customer.customerName || customer.name}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ProjectBadge hasProject={customer.hasProject} />
            {customer.hasProject && customer.projectType && (
              <ProjectTypeBadge type={customer.projectType} />
            )}
          </div>
        </div>

        {/* Action Buttons: Direct Call & WhatsApp */}
        <div 
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Phone:</span>
            <a 
              href={`tel:${cleanPhone}`} 
              style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem' }}
            >
              {customer.phone}
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href={`tel:${cleanPhone}`}
              className="btn btn-call btn-lg"
              title="Call directly"
            >
              <Phone size={18} /> Call Customer
            </a>

            <a
              href={`https://wa.me/${cleanPhone.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              title="WhatsApp"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Notes & Comments */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Project Details & Notes
        </h3>

        <div 
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            minHeight: '100px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem'
          }}
        >
          {customer.notes || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No additional notes provided.</span>}
        </div>

        <form onSubmit={handleAddNote}>
          <label className="form-label" htmlFor="append-note-input">
            Append Note
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="append-note-input"
              type="text"
              className="form-input"
              placeholder="Add follow-up notes or requirement update..."
              value={newQuickNote}
              onChange={(e) => setNewQuickNote(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSavingNote || !newQuickNote.trim()}
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { Phone, PhoneCall, CheckCircle2, X, Clock, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

export const CallDispositionModal = () => {
  const { callModalData, closeCallModal, completeCall } = useCustomers() || {};
  const { isOpen, customer } = callModalData || {};

  const [selectedOutcome, setSelectedOutcome] = useState('Called');
  const [callNotes, setCallNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setSelectedOutcome(customer.status === 'New' ? 'Called' : customer.status || 'Called');
      setCallNotes('');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');

  const outcomes = [
    { value: 'Called', label: 'Called / Left Message', icon: PhoneCall, color: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' },
    { value: 'Interested', label: 'Interested Prospect', icon: ThumbsUp, color: '#c084fc', border: 'rgba(192, 132, 252, 0.4)' },
    { value: 'Call Later', label: 'Call Back Later', icon: Clock, color: '#fb923c', border: 'rgba(251, 146, 60, 0.4)' },
    { value: 'Not Interested', label: 'Not Interested', icon: ThumbsDown, color: '#94a3b8', border: 'rgba(148, 163, 184, 0.4)' },
    { value: 'Converted', label: 'Deal Won / Converted!', icon: Sparkles, color: '#34d399', border: 'rgba(52, 211, 153, 0.4)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await completeCall(customer.id, selectedOutcome, callNotes);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={closeCallModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              <PhoneCall size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Call Outcome</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Logging call with <strong>{customer.name}</strong>
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-icon btn-secondary" 
            onClick={closeCallModal}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Direct Phone Dial Banner */}
            <div 
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Customer Number
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {customer.phone}
                </div>
              </div>

              {/* Direct tel link */}
              <a 
                href={`tel:${cleanPhone}`} 
                className="btn btn-call btn-sm"
                title="Tap to redial"
              >
                <Phone size={15} /> Redial
              </a>
            </div>

            {/* Outcome Selection Grid */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                How did the call go? Update status:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                {outcomes.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedOutcome === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedOutcome(opt.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface-elevated)',
                        border: `1.5px solid ${isSelected ? opt.border : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={18} style={{ color: opt.color }} />
                        <span style={{ fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Call Notes */}
            <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
              <label className="form-label" htmlFor="call-notes-input">
                Call Notes / Key Takeaways:
              </label>
              <textarea
                id="call-notes-input"
                className="form-textarea"
                rows={3}
                placeholder="E.g., Spoke with customer, requested quotation by email..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeCallModal}
              disabled={isSubmitting}
            >
              Skip / Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save & Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

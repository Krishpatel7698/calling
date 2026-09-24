import React, { useState, useEffect } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  Phone, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles,
  Calendar,
  FileText
} from 'lucide-react';

export const CallDispositionModal = () => {
  const { callModalData, closeCallModal, completeCall } = useCustomers() || {};
  const { isOpen, customer } = callModalData || {};

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [callNotes, setCallNotes] = useState('');
  const [duration, setDuration] = useState('3 min');
  const [nextDate, setNextDate] = useState('');
  const [nextTime, setNextTime] = useState('11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setSelectedOutcome(customer.leadStatus === 'New Lead' ? 'Contacted' : customer.leadStatus || 'Contacted');
      setCallNotes('');
      setNextDate(customer.followUpDate || tomorrowStr);
      setNextTime(customer.followUpTime || '11:00');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');

  const outcomes = [
    { value: 'Contacted', label: 'Contacted / Left Note', icon: PhoneCall, color: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' },
    { value: 'Interested', label: 'Interested Prospect', icon: ThumbsUp, color: '#c084fc', border: 'rgba(192, 132, 252, 0.4)' },
    { value: 'Proposal', label: 'Proposal / Quote Requested', icon: FileText, color: '#60a5fa', border: 'rgba(96, 165, 250, 0.4)' },
    { value: 'Negotiation', label: 'In Negotiation', icon: Clock, color: '#fb923c', border: 'rgba(251, 146, 60, 0.4)' },
    { value: 'Converted', label: 'Deal Won / Converted! 🏆', icon: Sparkles, color: '#34d399', border: 'rgba(52, 211, 153, 0.4)' },
    { value: 'Not Interested', label: 'Not Interested / Lost', icon: ThumbsDown, color: '#94a3b8', border: 'rgba(148, 163, 184, 0.4)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await completeCall(customer.id, selectedOutcome, callNotes, nextDate, nextTime, duration);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={closeCallModal}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Log Call & Follow-up</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {customer.companyName || customer.customerName}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Quick Dial Banner */}
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
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mobile / Phone
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {customer.phone}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.8rem'
                  }}
                  title="Call Duration"
                >
                  <option value="1 min">1 min</option>
                  <option value="2 min">2 min</option>
                  <option value="3 min">3 min</option>
                  <option value="5 min">5 min</option>
                  <option value="10 min">10 min</option>
                  <option value="15+ min">15+ min</option>
                </select>

                <a 
                  href={`tel:${cleanPhone}`} 
                  className="btn btn-call btn-sm"
                  title="Redial directly"
                >
                  <Phone size={14} /> Dial
                </a>
              </div>
            </div>

            {/* Outcome Selection Grid */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                Call Outcome / Stage Update:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.14)' : 'var(--bg-surface-elevated)',
                        border: `1.5px solid ${isSelected ? opt.border : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon size={16} style={{ color: opt.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule Next Follow-up */}
            {selectedOutcome !== 'Converted' && selectedOutcome !== 'Not Interested' && (
              <div 
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.06)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Calendar size={15} />
                  <span>Next Follow-up Reminder</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={nextTime}
                      onChange={(e) => setNextTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick Date Shortcuts */}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => { setNextDate(todayStr); setNextTime('16:00'); }}
                  >
                    Today 4 PM
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => { setNextDate(tomorrowStr); setNextTime('11:00'); }}
                  >
                    Tomorrow 11 AM
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => { 
                      const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
                      setNextDate(nextWeek);
                      setNextTime('11:00');
                    }}
                  >
                    In 1 Week
                  </button>
                </div>
              </div>
            )}

            {/* Call Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="call-notes-input">
                Call Notes / Key Conversation Summary:
              </label>
              <textarea
                id="call-notes-input"
                className="form-textarea"
                rows={3}
                placeholder="E.g., Client wants revised quote with 18% GST. Budget is ₹1.5L. Call back on Friday..."
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
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Call & Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

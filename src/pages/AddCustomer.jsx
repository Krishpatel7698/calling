import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  Building2, 
  User, 
  Phone, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  Smartphone,
  Globe,
  Briefcase,
  Cpu,
  Layers
} from 'lucide-react';

const PROJECT_TYPES = [
  { id: 'Mobile App', label: 'Mobile App', icon: Smartphone, desc: 'iOS & Android native or hybrid app' },
  { id: 'Website', label: 'Website', icon: Globe, desc: 'Corporate site, web portal, or e-commerce' },
  { id: 'CRM', label: 'CRM', icon: Briefcase, desc: 'Lead management & sales pipeline system' },
  { id: 'ERP', label: 'ERP', icon: Cpu, desc: 'Enterprise resource & operations planning' }
];

export const AddCustomer = ({ setActivePage }) => {
  const { addCustomer } = useCustomers();

  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasProject, setHasProject] = useState(true);
  const [projectType, setProjectType] = useState('Mobile App');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim()) {
      setErrorMessage('Please enter the company name.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    const result = await addCustomer({
      companyName: companyName.trim(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      hasProject,
      projectType: hasProject ? projectType : '',
      notes: notes.trim()
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessSaved(true);
      // Reset form
      setCompanyName('');
      setCustomerName('');
      setPhone('');
      setHasProject(true);
      setProjectType('Mobile App');
      setNotes('');
    } else {
      setErrorMessage(result.error || 'Failed to save inquiry. Please try again.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-icon btn-secondary btn-sm"
            onClick={() => setActivePage('customers')}
            title="Back to Customer List"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Save Project Inquiry</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Save customer details and development requirements directly to Firebase
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successSaved && (
        <div 
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={24} style={{ color: '#34d399', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#34d399' }}>Inquiry Saved Successfully!</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Recorded securely in Firebase Firestore.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActivePage('customers')}
            >
              View List
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSuccessSaved(false)}
            >
              Add Another
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div 
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '0.88rem'
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Main Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* 1. Company Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="company-name-input">
              1. Company Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="company-name-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Apex Logistics, TechNova Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <Building2 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} 
              />
            </div>
          </div>

          {/* 2. Customer Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="customer-name-input">
              2. Customer Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="customer-name-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. John Doe, Priya Patel"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <User 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} 
              />
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="customer-phone-input">
              3. Phone Number *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="customer-phone-input"
                type="tel"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. +91 98765 43210 or +1 (555) 234-8901"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Phone 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }} 
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              The Call button will directly dial this number on mobile phones.
            </span>
          </div>

          {/* 4. Is there a Project? (Yes / No) */}
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label">
              4. Is there a Project? *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Option Yes */}
              <button
                type="button"
                id="project-yes-btn"
                onClick={() => setHasProject(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: hasProject ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg-surface-elevated)',
                  border: `2px solid ${hasProject ? '#10b981' : 'var(--border-subtle)'}`,
                  color: hasProject ? '#34d399' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <CheckCircle2 size={18} />
                <span>Yes</span>
              </button>

              {/* Option No */}
              <button
                type="button"
                id="project-no-btn"
                onClick={() => setHasProject(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: !hasProject ? 'rgba(148, 163, 184, 0.16)' : 'var(--bg-surface-elevated)',
                  border: `2px solid ${!hasProject ? '#94a3b8' : 'var(--border-subtle)'}`,
                  color: !hasProject ? '#f8fafc' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>No</span>
              </button>
            </div>
          </div>

          {/* 5. What needs to be created? (Conditional: only if hasProject is true) */}
          {hasProject && (
            <div 
              style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-lg)',
                animation: 'fadeIn 0.25s ease-out'
              }}
            >
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa' }}>
                <Layers size={16} />
                <span>5. What needs to be created? *</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      id={`type-btn-${type.id.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setProjectType(type.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        padding: '1rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-surface)',
                        border: `1.5px solid ${isSelected ? '#3b82f6' : 'var(--border-subtle)'}`,
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={22} style={{ color: isSelected ? '#60a5fa' : 'var(--text-tertiary)' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
            <label className="form-label" htmlFor="inquiry-notes">
              Additional Details / Notes (Optional)
            </label>
            <textarea
              id="inquiry-notes"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Budget expectations, key deadlines, requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActivePage('customers')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              id="submit-inquiry-btn"
            >
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'Saving to Firebase...' : 'Save Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

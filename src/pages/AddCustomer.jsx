import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  Building2, 
  User, 
  Phone, 
  Mail,
  MapPin,
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  Smartphone,
  Globe,
  Briefcase,
  Cpu,
  Layers,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';

const PROJECT_TYPES = [
  { id: 'Mobile App', label: 'Mobile App', icon: Smartphone, desc: 'iOS & Android app' },
  { id: 'Website', label: 'Website', icon: Globe, desc: 'Corporate site or e-commerce' },
  { id: 'CRM', label: 'CRM', icon: Briefcase, desc: 'Lead management & calling CRM' },
  { id: 'ERP', label: 'ERP', icon: Cpu, desc: 'Enterprise operations software' }
];

export const AddCustomer = ({ setActivePage }) => {
  const { addCustomer, leadSources, leadStatuses, companySettings } = useCustomers();

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState(tomorrowStr);
  const [assignedTo, setAssignedTo] = useState('Master Admin');
  const [leadSource, setLeadSource] = useState('Website');
  const [leadStatus, setLeadStatus] = useState('New Lead');
  const [hasProject, setHasProject] = useState(true);
  const [projectType, setProjectType] = useState('Mobile App');
  const [followUpDate, setFollowUpDate] = useState(todayStr);
  const [followUpTime, setFollowUpTime] = useState('11:00');
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
      setErrorMessage('Please enter the customer / contact person name.');
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
      email: email.trim(),
      address: address.trim(),
      dealValue: Number(dealValue) || 0,
      expectedCloseDate,
      assignedTo,
      leadSource,
      leadStatus,
      hasProject,
      projectType: hasProject ? projectType : '',
      followUpDate,
      followUpTime,
      notes: notes.trim()
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessSaved(true);
      // Reset form
      setCompanyName('');
      setCustomerName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setDealValue('');
      setNotes('');
    } else {
      setErrorMessage(result.error || 'Failed to save lead. Please try again.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>
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
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Add New Customer / Lead</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Save contact person, company details, pipeline stage, and follow-up reminders
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
              <div style={{ fontWeight: 700, color: '#34d399' }}>Lead Saved Successfully!</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Recorded securely and scheduled for follow-up.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActivePage('customers')}
            >
              View Leads List
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

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Company & Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="company-name-input">
                Company Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="company-name-input"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Apex Innovations Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Building2 
                  size={17} 
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-name-input">
                Contact Person Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="customer-name-input"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <User 
                  size={17} 
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="customer-phone-input">
                Mobile Number *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="customer-phone-input"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Phone 
                  size={17} 
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-email-input">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="customer-email-input"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. client@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail 
                  size={17} 
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-address-input">
              Address / City / Location
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="customer-address-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. 402, Titanium City Centre, Ahmedabad, Gujarat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <MapPin 
                size={17} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
            </div>
          </div>

          {/* Section 2: Pipeline, Deal Value & Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Deal Value ({companySettings.currency || '₹'})</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="e.g. 85000"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                />
                <DollarSign 
                  size={16}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#34d399' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lead Source</label>
              <select
                className="form-input"
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
              >
                {leadSources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To Employee</label>
              <select
                className="form-input"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="Master Admin">Master Admin</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Priya Patel">Priya Patel</option>
              </select>
            </div>
          </div>

          {/* Section 3: Next Follow-up Alert */}
          <div 
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(251, 191, 36, 0.06)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <Calendar size={15} />
              <span>Schedule Initial Call / Follow-up</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Follow-up Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Preferred Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Project Requirement (Yes/No) */}
          <div className="form-group">
            <label className="form-label">Does this customer have a software project requirement?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setHasProject(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: hasProject ? 'rgba(16, 185, 129, 0.16)' : 'var(--bg-surface-elevated)',
                  border: `2px solid ${hasProject ? '#10b981' : 'var(--border-subtle)'}`,
                  color: hasProject ? '#34d399' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={17} /> Yes
              </button>

              <button
                type="button"
                onClick={() => setHasProject(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: !hasProject ? 'rgba(148, 163, 184, 0.16)' : 'var(--bg-surface-elevated)',
                  border: `2px solid ${!hasProject ? '#94a3b8' : 'var(--border-subtle)'}`,
                  color: !hasProject ? '#f8fafc' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                No
              </button>
            </div>
          </div>

          {hasProject && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Project Type:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.85rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-surface)',
                        border: `1.5px solid ${isSelected ? '#3b82f6' : 'var(--border-subtle)'}`,
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={20} style={{ color: isSelected ? '#60a5fa' : 'var(--text-tertiary)' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 5: Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="inquiry-notes">
              Customer Background & Notes
            </label>
            <textarea
              id="inquiry-notes"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Budget range, key objectives, previous vendor issues..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
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
            >
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'Saving Lead...' : 'Save Lead Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

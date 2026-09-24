import React, { useState, useEffect } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { X, Building2, User, Phone, CheckCircle2, Layers, Mail, MapPin, DollarSign } from 'lucide-react';

const PROJECT_TYPES = ['Mobile App', 'Website', 'CRM', 'ERP'];

export const EditCustomerModal = () => {
  const { 
    editModalData, 
    closeEditModal, 
    updateCustomer, 
    leadSources, 
    leadStatuses, 
    companySettings 
  } = useCustomers();
  const { isOpen, customer } = editModalData;

  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('Master Admin');
  const [leadSource, setLeadSource] = useState('Website');
  const [leadStatus, setLeadStatus] = useState('New Lead');
  const [hasProject, setHasProject] = useState(true);
  const [projectType, setProjectType] = useState('Mobile App');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setCompanyName(customer.companyName || '');
      setCustomerName(customer.customerName || customer.name || '');
      setPhone(customer.phone || '');
      setEmail(customer.email || '');
      setAddress(customer.address || '');
      setDealValue(String(customer.dealValue || ''));
      setExpectedCloseDate(customer.expectedCloseDate || '');
      setAssignedTo(customer.assignedTo || 'Master Admin');
      setLeadSource(customer.leadSource || 'Website');
      setLeadStatus(customer.leadStatus || customer.status || 'New Lead');
      setHasProject(Boolean(customer.hasProject));
      setProjectType(customer.projectType || 'Mobile App');
      setNotes(customer.notes || '');
      setError('');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }
    if (!customerName.trim()) {
      setError('Contact person name is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setIsSubmitting(true);
    await updateCustomer(customer.id, {
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
      status: leadStatus,
      hasProject,
      projectType: hasProject ? projectType : '',
      notes: notes.trim()
    });
    setIsSubmitting(false);
    closeEditModal();
  };

  return (
    <div className="modal-overlay" onClick={closeEditModal}>
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Edit Customer & Lead Details</h3>
          <button 
            type="button" 
            className="btn-icon btn-secondary" 
            onClick={closeEditModal}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div 
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}
              >
                {error}
              </div>
            )}

            {/* Company & Contact Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-company-name">
                  Company Name *
                </label>
                <input
                  id="edit-company-name"
                  type="text"
                  className="form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Innovations"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-customer-name">
                  Contact Person *
                </label>
                <input
                  id="edit-customer-name"
                  type="text"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-phone">
                  Phone Number *
                </label>
                <input
                  id="edit-phone"
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-email">
                  Email Address
                </label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@company.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-address">
                Office / Billing Address
              </label>
              <input
                id="edit-address"
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, State"
              />
            </div>

            {/* Pipeline Stage, Deal Value & Assignee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Pipeline Stage</label>
                <select
                  className="form-input"
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                >
                  {leadStatuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deal Value ({companySettings.currency || '₹'})</label>
                <input
                  type="number"
                  className="form-input"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assignee</label>
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

            {/* Project (Yes/No) & Type */}
            <div className="form-group">
              <label className="form-label">Project Requirement?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setHasProject(true)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: hasProject ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${hasProject ? '#10b981' : 'var(--border-subtle)'}`,
                    color: hasProject ? '#34d399' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasProject(false)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: !hasProject ? 'rgba(148, 163, 184, 0.2)' : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${!hasProject ? '#94a3b8' : 'var(--border-subtle)'}`,
                    color: !hasProject ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
              </div>
            </div>

            {hasProject && (
              <div className="form-group">
                <label className="form-label" htmlFor="edit-project-type">
                  Project Type
                </label>
                <select
                  id="edit-project-type"
                  className="form-select"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="edit-notes">
                Customer Notes
              </label>
              <textarea
                id="edit-notes"
                className="form-textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional inquiry notes..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeEditModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

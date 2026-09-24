import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { ProjectBadge, ProjectTypeBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Mail,
  Edit, 
  Trash2, 
  Building2, 
  User, 
  Calendar,
  Layers,
  Send,
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle,
  MapPin,
  DollarSign,
  Share2,
  Tag,
  ShieldAlert
} from 'lucide-react';

export const CustomerDetails = ({ customerId, setActivePage }) => {
  const { 
    customers, 
    openEditModal, 
    deleteCustomer, 
    updateCustomer,
    openCallModal,
    addCustomerDocument,
    deleteCustomerDocument,
    companySettings,
    moveLeadStage
  } = useCustomers();

  const customer = customers.find((c) => c.id === customerId);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'calls', 'whatsapp', 'docs', 'notes'
  const [newQuickNote, setNewQuickNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Document upload state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('PDF');

  // Follow-up quick scheduler
  const [followUpDate, setFollowUpDate] = useState(customer?.followUpDate || '');
  const [followUpTime, setFollowUpTime] = useState(customer?.followUpTime || '11:00');
  const [isSavingFollowUp, setIsSavingFollowUp] = useState(false);

  if (!customer) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3>Inquiry / Lead not found</h3>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setActivePage('customers')}
          style={{ marginTop: '1rem' }}
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');
  const companyInitial = (customer.companyName || customer.customerName || 'C')[0].toUpperCase();
  const currency = companySettings.currency || '₹';

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newQuickNote.trim()) return;

    setIsSavingNote(true);
    const existing = customer.notes || '';
    const timestamp = new Date().toLocaleString();
    const updatedNotes = existing 
      ? `[${timestamp}]: ${newQuickNote.trim()}\n\n${existing}`
      : `[${timestamp}]: ${newQuickNote.trim()}`;

    await updateCustomer(customer.id, { notes: updatedNotes });
    setNewQuickNote('');
    setIsSavingNote(false);
  };

  const handleSaveFollowUp = async () => {
    setIsSavingFollowUp(true);
    await updateCustomer(customer.id, { followUpDate, followUpTime });
    setIsSavingFollowUp(false);
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docName.trim()) return;
    await addCustomerDocument(customer.id, {
      name: docName.trim() + (docName.includes('.') ? '' : `.${docType.toLowerCase()}`),
      type: docType,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    });
    setDocName('');
  };

  // WhatsApp Templates
  const whatsappTemplates = [
    {
      title: 'Introductory Message',
      text: `Hello ${customer.customerName || ''}, thank you for your interest in ${companySettings.companyName}. We are glad to connect with ${customer.companyName}. When would be a good time for a quick 5-minute call?`
    },
    {
      title: 'Follow-up on Proposal',
      text: `Hi ${customer.customerName || ''}, following up on the proposal we sent for ${customer.companyName}. Do you have any questions or feedback we can discuss today?`
    },
    {
      title: 'Quotation Ready',
      text: `Dear ${customer.customerName || ''}, we have finalized the estimate for your ${customer.projectType || 'software'} project. Please let us know when we can review it together.`
    },
    {
      title: 'Payment Reminder',
      text: `Dear ${customer.customerName || ''}, friendly reminder regarding the pending invoice for ${customer.companyName}. Kindly arrange for settlement at your earliest convenience.`
    }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Top Bar with Back Button & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setActivePage('customers')}
        >
          <ArrowLeft size={16} /> Back to Leads
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openEditModal(customer)}
          >
            <Edit size={15} /> Edit Lead
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Delete record for ${customer.companyName || customer.customerName}?`)) {
                deleteCustomer(customer.id, customer.companyName || customer.customerName);
                setActivePage('customers');
              }
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#FFFFFF',
                flexShrink: 0
              }}
            >
              {companyInitial}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {customer.companyName || 'Unnamed Company'}
                </h2>
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
                        : 'var(--border-subtle)'
                  }}
                >
                  {customer.leadStatus || customer.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={15} /> {customer.customerName || customer.name}
                </span>
                {customer.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={15} /> {customer.email}
                  </span>
                )}
                {customer.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} /> {customer.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Dial Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a
              href={`tel:${cleanPhone}`}
              className="btn btn-call btn-lg"
              onClick={() => openCallModal(customer)}
              title="Call directly and log outcome"
            >
              <Phone size={18} /> Call Customer
            </a>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => openCallModal(customer)}
              title="Log call outcome manually"
            >
              <Clock size={16} /> Log Call
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div 
          style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Deal Value:</span>
            <div style={{ fontWeight: 800, color: '#34d399', fontFamily: 'monospace', fontSize: '1.1rem' }}>
              {currency}{Number(customer.dealValue || 0).toLocaleString()}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Assigned Employee:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {customer.assignedTo || 'Master Admin'}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Lead Source:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {customer.leadSource || 'Website'}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Next Follow-up:</span>
            <div style={{ fontWeight: 700, color: customer.followUpDate ? '#fbbf24' : 'var(--text-tertiary)' }}>
              {customer.followUpDate ? `${customer.followUpDate} (${customer.followUpTime || '11:00'})` : 'Not Scheduled'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="crm-tabs">
        <button
          type="button"
          className={`crm-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Building2 size={16} /> Overview & Pipeline
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          <Phone size={16} /> Call History ({customer.callHistory?.length || 0})
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageCircle size={16} /> WhatsApp & Email
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <FileText size={16} /> Documents ({customer.documents?.length || 0})
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <Calendar size={16} /> Notes & Activity
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PIPELINE STAGE */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Stage Progression Selector */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              Sales Pipeline Stage
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Current stage in sales funnel. Click any stage to transition lead:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['New Lead', 'Contacted', 'Interested', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((st) => {
                const isCurrent = (customer.leadStatus || customer.status) === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => moveLeadStage(customer.id, st)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCurrent ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${isCurrent ? '#3b82f6' : 'var(--border-subtle)'}`,
                      color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{st}</span>
                    {isCurrent && <CheckCircle size={16} style={{ color: '#38bdf8' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow-up Scheduler Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              Next Follow-up Scheduling
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Set an alert for the next contact touchpoint:
            </p>

            <div className="form-group">
              <label className="form-label">Follow-up Date</label>
              <input
                type="date"
                className="form-input"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Follow-up Time</label>
              <input
                type="time"
                className="form-input"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveFollowUp}
              disabled={isSavingFollowUp}
            >
              {isSavingFollowUp ? 'Saving...' : 'Update Follow-up Schedule'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CALL HISTORY */}
      {activeTab === 'calls' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Call Logs & Interaction Records
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openCallModal(customer)}
            >
              <Phone size={14} /> Log New Call
            </button>
          </div>

          {(!customer.callHistory || customer.callHistory.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Clock size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem' }} />
              <p>No phone calls logged for this customer yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {customer.callHistory.map((call) => (
                <div
                  key={call.id}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          fontSize: '0.75rem'
                        }}
                      >
                        {call.outcome}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Caller: <strong>{call.caller || 'Staff'}</strong> ({call.duration || '2 min'})
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {new Date(call.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {call.note && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.4rem', whiteSpace: 'pre-wrap' }}>
                      {call.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WHATSAPP & EMAIL INTEGRATION */}
      {activeTab === 'whatsapp' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* WhatsApp Templates */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MessageCircle size={20} style={{ color: '#22c55e' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>WhatsApp Pre-crafted Templates</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {whatsappTemplates.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {t.title}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                    "{t.text}"
                  </p>
                  <a
                    href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(t.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                  >
                    <MessageCircle size={14} /> Send via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Email Integration */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Mail size={20} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Email Integration</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Client email: <strong>{customer.email || 'No email registered'}</strong>
            </p>

            {customer.email ? (
              <a
                href={`mailto:${customer.email}?subject=${encodeURIComponent(`Project Discussion - ${companySettings.companyName}`)}&body=${encodeURIComponent(`Hello ${customer.customerName},\n\nThank you for speaking with us regarding ${customer.companyName}.\n\nBest regards,\n${companySettings.companyName}`)}`}
                className="btn btn-primary"
              >
                <Mail size={16} /> Open Email Client
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => openEditModal(customer)}
              >
                + Add Client Email Address
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTS & FILES */}
      {activeTab === 'docs' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Attached Project Documents & Files</h3>
          </div>

          {/* Add Document Simulator */}
          <form onSubmit={handleUploadDoc} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, minWidth: 200 }}
              placeholder="e.g. Scope_Requirement_v2, Signed_Contract..."
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />
            <select
              className="form-input"
              style={{ width: 110 }}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="PNG">Image</option>
            </select>
            <button type="submit" className="btn btn-primary">
              <Upload size={15} /> Attach File
            </button>
          </form>

          {(!customer.documents || customer.documents.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              <FileText size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem' }} />
              <p>No documents attached to this lead yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {customer.documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}
                    >
                      {doc.type}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {doc.size} • Uploaded {doc.uploadDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => alert(`Simulating file download for ${doc.name}`)}
                    >
                      <Download size={14} /> Download
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-secondary btn-sm"
                      onClick={() => deleteCustomerDocument(customer.id, doc.id)}
                      title="Remove file"
                    >
                      <Trash2 size={14} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: NOTES & TIMELINE */}
      {activeTab === 'notes' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Internal Notes & Customer History
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
              minHeight: '120px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}
          >
            {customer.notes || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No notes logged yet.</span>}
          </div>

          <form onSubmit={handleAddNote}>
            <label className="form-label" htmlFor="append-note-input">
              Append New Note:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="append-note-input"
                type="text"
                className="form-input"
                placeholder="Type note and hit enter to log with timestamp..."
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
      )}
    </div>
  );
};

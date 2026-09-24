import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';
import { 
  getActiveFirebaseConfig, 
  testFirebaseCredentials
} from '../services/firebase';
import { 
  Database, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Key,
  FileCode,
  CheckCircle,
  Building2,
  Users,
  Tag,
  ShoppingBag,
  History,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  Lock,
  RefreshCw
} from 'lucide-react';

export const Settings = () => {
  const { 
    currentUser, 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    isFirebaseConnected 
  } = useAuth();

  const { 
    customers, 
    showToast, 
    companySettings, 
    updateCompanySettings,
    products, 
    setProducts,
    leadSources,
    setLeadSources,
    leadStatuses,
    setLeadStatuses,
    auditLogs
  } = useCustomers();

  const currentConfig = getActiveFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    messagingSenderId: '',
    appId: ''
  };

  const [activeTab, setActiveTab] = useState('company'); // 'company', 'employees', 'catalog', 'sources', 'firebase', 'backup'

  // Company Form State
  const [compForm, setCompForm] = useState({ ...companySettings });

  // Add Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Sales Executive');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpPass, setNewEmpPass] = useState('staff123');

  // New Catalog Product State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Development');
  const [newProdPrice, setNewProdPrice] = useState('');

  // Source / Status add input
  const [newSourceInput, setNewSourceInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState('');

  // Testing connection state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedEnvSnippet, setCopiedEnvSnippet] = useState(false);

  // Save company form
  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateCompanySettings(compForm);
  };

  // Add Employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim()) return;
    addEmployee({
      name: newEmpName.trim(),
      email: newEmpEmail.trim(),
      role: newEmpRole,
      phone: newEmpPhone.trim(),
      password: newEmpPass
    });
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPhone('');
    showToast(`Staff member "${newEmpName}" registered`, 'success');
  };

  // Add Catalog Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;
    const newProd = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice)
    };
    const updated = [...products, newProd];
    setProducts(updated);
    try { localStorage.setItem('calling_products', JSON.stringify(updated)); } catch {}
    setNewProdName('');
    setNewProdPrice('');
    showToast(`Added "${newProd.name}" to catalog`, 'success');
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try { localStorage.setItem('calling_products', JSON.stringify(updated)); } catch {}
  };

  // Add Lead Source
  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceInput.trim()) return;
    const val = newSourceInput.trim();
    if (!leadSources.includes(val)) {
      const updated = [...leadSources, val];
      setLeadSources(updated);
      try { localStorage.setItem('calling_lead_sources', JSON.stringify(updated)); } catch {}
      setNewSourceInput('');
      showToast(`Added "${val}" to lead sources`, 'success');
    }
  };

  const handleDeleteSource = (source) => {
    const updated = leadSources.filter((s) => s !== source);
    setLeadSources(updated);
    try { localStorage.setItem('calling_lead_sources', JSON.stringify(updated)); } catch {}
  };

  // Add Lead Status
  const handleAddStatus = (e) => {
    e.preventDefault();
    if (!newStatusInput.trim()) return;
    const val = newStatusInput.trim();
    if (!leadStatuses.includes(val)) {
      const updated = [...leadStatuses, val];
      setLeadStatuses(updated);
      try { localStorage.setItem('calling_lead_statuses', JSON.stringify(updated)); } catch {}
      setNewStatusInput('');
      showToast(`Added "${val}" to lead statuses`, 'success');
    }
  };

  const handleDeleteStatus = (st) => {
    const updated = leadStatuses.filter((s) => s !== st);
    setLeadStatuses(updated);
    try { localStorage.setItem('calling_lead_statuses', JSON.stringify(updated)); } catch {}
  };

  // Test current .env Firebase Connection Live
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    const res = await testFirebaseCredentials(currentConfig);
    setTestingConnection(false);
    setTestResult(res);
  };

  // Export customers to CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      showToast('No customer records to export', 'info');
      return;
    }
    const headers = ['ID', 'Company Name', 'Customer Name', 'Phone', 'Email', 'Status', 'Deal Value', 'Date Added'];
    const rows = customers.map((c) => [
      `"${c.id}"`,
      `"${(c.companyName || '').replace(/"/g, '""')}"`,
      `"${(c.customerName || c.name || '').replace(/"/g, '""')}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.leadStatus || c.status || ''}"`,
      `"${c.dealValue || 0}"`,
      `"${c.createdAt || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `callpulse_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('Customer data exported to CSV', 'success');
  };

  // Full Database JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      companySettings,
      employees,
      customers,
      products,
      leadSources,
      leadStatuses
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `callpulse_crm_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Full CRM backup downloaded (JSON)', 'success');
  };

  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Admin Settings & CRM Control Panel</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Manage company branding, team permissions, pipeline settings, catalog, and cloud security
        </p>
      </div>

      {/* Tabs */}
      <div className="crm-tabs">
        <button
          type="button"
          className={`crm-tab ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <Building2 size={16} /> Company Details
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <Users size={16} /> Employees & Roles ({employees.length})
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <ShoppingBag size={16} /> Products & Services ({products.length})
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          <Tag size={16} /> Sources & Statuses
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'firebase' ? 'active' : ''}`}
          onClick={() => setActiveTab('firebase')}
        >
          <ShieldCheck size={16} /> Firebase & Security
        </button>

        <button
          type="button"
          className={`crm-tab ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Database size={16} /> Backup & Audit Logs
        </button>
      </div>

      {/* TAB 1: COMPANY DETAILS */}
      {activeTab === 'company' && (
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Company Details & Invoicing Information
          </h3>

          <form onSubmit={handleSaveCompany}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Company Legal Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={compForm.companyName}
                  onChange={(e) => setCompForm({ ...compForm, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline / Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={compForm.tagline}
                  onChange={(e) => setCompForm({ ...compForm, tagline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Official Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={compForm.phone}
                  onChange={(e) => setCompForm({ ...compForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={compForm.email}
                  onChange={(e) => setCompForm({ ...compForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  className="form-input"
                  value={compForm.website}
                  onChange={(e) => setCompForm({ ...compForm, website: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registered Office Address</label>
              <input
                type="text"
                className="form-input"
                value={compForm.address}
                onChange={(e) => setCompForm({ ...compForm, address: e.target.value })}
              />
            </div>

            {/* Tax & Banking Section */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', color: '#93c5fd' }}>
                Tax & Bank Accounts (For Quotations & Invoices)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={compForm.gstin}
                    onChange={(e) => setCompForm({ ...compForm, gstin: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={compForm.pan}
                    onChange={(e) => setCompForm({ ...compForm, pan: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Currency Symbol</label>
                  <select
                    className="form-input"
                    value={compForm.currency}
                    onChange={(e) => setCompForm({ ...compForm, currency: e.target.value })}
                  >
                    <option value="₹">₹ (INR - Indian Rupee)</option>
                    <option value="$">$ (USD - US Dollar)</option>
                    <option value="€">€ (EUR - Euro)</option>
                    <option value="£">£ (GBP - British Pound)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={compForm.bankName}
                    onChange={(e) => setCompForm({ ...compForm, bankName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">A/C Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={compForm.accountNumber}
                    onChange={(e) => setCompForm({ ...compForm, accountNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={compForm.ifscCode}
                    onChange={(e) => setCompForm({ ...compForm, ifscCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Invoice Terms & Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={compForm.invoiceTerms}
                  onChange={(e) => setCompForm({ ...compForm, invoiceTerms: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Company Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: EMPLOYEES & ROLES */}
      {activeTab === 'employees' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Add Employee Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Add Staff / Employee
            </h3>

            <form onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Login ID) *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. rahul@calling.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role & Permission *</label>
                <select
                  className="form-input"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                >
                  <option value="Admin">Admin (Full Control, Settings, All Leads)</option>
                  <option value="Sales Executive">Sales Executive (Assigned Leads, Calling, Deals)</option>
                  <option value="Manager">Manager (Supervisory, Reports, Quotations)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 00000"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Default Password</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEmpPass}
                  onChange={(e) => setNewEmpPass(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Register Employee
              </button>
            </form>
          </div>

          {/* Employee Roster */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Active Team Roster ({employees.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {employees.map((emp) => (
                <div
                  key={emp.id || emp.email}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div 
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: emp.avatarColor || '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {emp.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                        {emp.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        {emp.email} • {emp.phone || 'No phone'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: emp.role === 'Admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: emp.role === 'Admin' ? '#60a5fa' : '#34d399',
                        fontSize: '0.72rem'
                      }}
                    >
                      {emp.role}
                    </span>

                    {emp.email !== 'admin@calling.com' && (
                      <button
                        type="button"
                        className="btn-icon btn-secondary btn-sm"
                        onClick={() => deleteEmployee(emp.id)}
                        title="Delete staff member"
                      >
                        <Trash2 size={14} style={{ color: '#f87171' }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & SERVICES CATALOG */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Add Product / Service
            </h3>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Service / Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. iOS & Android Mobile App"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                >
                  <option value="Development">Development</option>
                  <option value="Web">Web Design</option>
                  <option value="Software">Software & CRM</option>
                  <option value="Enterprise">Enterprise ERP</option>
                  <option value="Support">Support & AMC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Default Rate / Price ({compForm.currency || '₹'}) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 85000"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Add to Catalog
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Products & Services Catalog ({products.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {p.name}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      Category: {p.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <strong style={{ color: '#34d399', fontFamily: 'monospace' }}>
                      {compForm.currency || '₹'}{Number(p.price).toLocaleString()}
                    </strong>
                    <button
                      type="button"
                      className="btn-icon btn-secondary btn-sm"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      <Trash2 size={14} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOURCES & STATUSES */}
      {activeTab === 'sources' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Lead Sources */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Lead Sources ({leadSources.length})
            </h3>

            <form onSubmit={handleAddSource} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New source (e.g. Billboard, Cold Email)..."
                value={newSourceInput}
                onChange={(e) => setNewSourceInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {leadSources.map((s) => (
                <div
                  key={s}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSource(s)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Statuses */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Lead & Pipeline Statuses ({leadStatuses.length})
            </h3>

            <form onSubmit={handleAddStatus} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="New status (e.g. Free Trial, Under Review)..."
                value={newStatusInput}
                onChange={(e) => setNewStatusInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {leadStatuses.map((st) => (
                <div
                  key={st}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span>{st}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStatus(st)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FIREBASE & SECURITY */}
      {activeTab === 'firebase' && (
        <div>
          {/* Connection Status Banner */}
          <div 
            className="card"
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              backgroundColor: 'var(--bg-surface)',
              border: isFirebaseConnected ? '1px solid var(--success-border)' : '1px solid var(--warning-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div 
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isFirebaseConnected ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: isFirebaseConnected ? 'var(--success)' : 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {isFirebaseConnected ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isFirebaseConnected ? 'var(--success)' : 'var(--warning)' }}>
                  {isFirebaseConnected ? 'Connected to Firebase Firestore' : 'Firebase Disconnected'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Active Project: <strong>{currentConfig.projectId || 'None'}</strong> (Configured via .env)
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestConnection}
              disabled={testingConnection}
            >
              {testingConnection ? 'Testing...' : 'Test Connection Live'}
            </button>
          </div>

          {testResult && (
            <div 
              style={{
                backgroundColor: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${testResult.success ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: testResult.success ? '#34d399' : '#f87171',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Firebase Configuration Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Active Firebase Environment Keys
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_PROJECT_ID</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>{currentConfig.projectId || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_AUTH_DOMAIN</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>{currentConfig.authDomain || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_API_KEY</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>••••••••{currentConfig.apiKey?.slice(-4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & AUDIT LOGS */}
      {activeTab === 'backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Operations & Backups */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Data Export & Full Backups
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Export Leads (Spreadsheet CSV)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Download all {customers.length} customer records, phone numbers, and stage info to CSV.
                </div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={handleExportCSV}>
                <Download size={15} /> Export CSV
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Full Database Backup (JSON)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Export all leads, tasks, quotations, employees, and settings as a portable JSON snapshot.
                </div>
              </div>
              <button type="button" className="btn btn-primary" onClick={handleExportJSON}>
                <Database size={15} /> Download Full Backup
              </button>
            </div>
          </div>

          {/* Module 10: Activity & Audit Logs */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} style={{ color: '#38bdf8' }} />
              <span>Activity & Security Audit Trail</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '420px', overflowY: 'auto' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          fontSize: '0.72rem'
                        }}
                      >
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.user}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {log.details}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

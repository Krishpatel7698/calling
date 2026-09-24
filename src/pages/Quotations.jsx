import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { QuotationPrintModal } from '../components/QuotationPrintModal';
import { 
  FileText, 
  Plus, 
  Printer, 
  Trash2, 
  CheckCircle, 
  Building2, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  X,
  CreditCard,
  History
} from 'lucide-react';

export const Quotations = () => {
  const { 
    quotations, 
    addQuotation, 
    deleteQuotation, 
    recordPayment, 
    convertQuotationToInvoice,
    customers, 
    companySettings,
    products
  } = useCustomers();

  const todayStr = new Date().toISOString().slice(0, 10);
  const nextWeekStr = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
  const currency = companySettings.currency || '₹';

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Quotation', 'Invoice', 'Pending', 'Paid'

  // Print/Preview Modal
  const [activePrintQuote, setActivePrintQuote] = useState(null);

  // Record Payment Modal
  const [paymentModalQuote, setPaymentModalQuote] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [payRef, setPayRef] = useState('');
  const [payDate, setPayDate] = useState(todayStr);

  // New Quotation / Invoice Form Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [docType, setDocType] = useState('Quotation'); // 'Quotation' or 'Invoice'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [issueDate, setIssueDate] = useState(todayStr);
  const [validUntil, setValidUntil] = useState(nextWeekStr);

  // Line items state
  const [items, setItems] = useState([
    { id: '1', description: 'Cross-platform Mobile App Development (iOS & Android)', qty: 1, rate: 85000, amount: 85000 }
  ]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxRate, setTaxRate] = useState(18); // 18% GST
  const [notes, setNotes] = useState(companySettings.invoiceTerms || '');

  // Calculate live totals
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const discountAmount = Math.round((subtotal * Number(discountPercent)) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * Number(taxRate)) / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Auto-fill client details when customer is selected
  const handleCustomerSelect = (custId) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCompanyName(found.companyName || '');
      setCustomerName(found.customerName || found.name || '');
      setPhone(found.phone || '');
      setEmail(found.email || '');
      setAddress(found.address || '');
    }
  };

  const handleAddItem = (prod) => {
    const newItem = {
      id: String(Date.now()),
      description: prod ? prod.name : 'Custom Software Service / Feature',
      qty: 1,
      rate: prod ? prod.price : 10000,
      amount: prod ? prod.price : 10000
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'qty' || field === 'rate') {
      const q = Number(field === 'qty' ? value : updated[index].qty) || 0;
      const r = Number(field === 'rate' ? value : updated[index].rate) || 0;
      updated[index].amount = q * r;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveQuotation = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    await addQuotation({
      type: docType,
      customerId: selectedCustomerId,
      companyName,
      customerName,
      email,
      phone,
      address,
      date: issueDate,
      validUntil,
      items,
      subtotal,
      discountPercent,
      discountAmount,
      taxRate,
      taxAmount,
      grandTotal,
      notes
    });

    setIsCreateModalOpen(false);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalQuote || !payAmount) return;

    await recordPayment(paymentModalQuote.id, {
      amount: Number(payAmount),
      mode: payMode,
      reference: payRef,
      date: payDate
    });

    setPaymentModalQuote(null);
    setPayAmount('');
    setPayRef('');
  };

  const filteredQuotes = quotations.filter((q) => {
    if (activeTab === 'Quotation' && q.type !== 'Quotation') return false;
    if (activeTab === 'Invoice' && q.type !== 'Invoice') return false;
    if (activeTab === 'Pending' && (q.paymentStatus === 'Paid' || q.type !== 'Invoice')) return false;
    if (activeTab === 'Paid' && q.paymentStatus !== 'Paid') return false;
    return true;
  });

  return (
    <div className="page-container" style={{ maxWidth: '1080px' }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Quotations & Invoices (GST Compliant)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Create professional PDF estimates, GST invoices, track payment status, and record transaction history
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setDocType('Quotation');
            setIsCreateModalOpen(true);
          }}
        >
          <Plus size={16} /> Create Quotation / Invoice
        </button>
      </div>

      {/* Filter Tabs */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'All', label: 'All Documents', count: quotations.length },
          { id: 'Quotation', label: 'Quotations', count: quotations.filter((q) => q.type === 'Quotation').length },
          { id: 'Invoice', label: 'Invoices', count: quotations.filter((q) => q.type === 'Invoice').length },
          { id: 'Pending', label: 'Pending Payments', count: quotations.filter((q) => q.type === 'Invoice' && q.paymentStatus !== 'Paid').length },
          { id: 'Paid', label: 'Paid Invoices', count: quotations.filter((q) => q.paymentStatus === 'Paid').length }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.18)' : 'var(--bg-surface)',
              border: activeTab === tab.id ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
              color: activeTab === tab.id ? '#60a5fa' : 'var(--text-secondary)'
            }}
          >
            <span>{tab.label}</span>
            <span 
              style={{
                fontSize: '0.72rem',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'var(--bg-surface-elevated)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-tertiary)'
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Quotations List */}
      {filteredQuotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
          <FileText size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No records found</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Click "Create Quotation / Invoice" above to generate your first document.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredQuotes.map((q) => {
            const isInvoice = q.type === 'Invoice';
            const isPaid = q.paymentStatus === 'Paid';

            return (
              <div 
                key={q.id} 
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isInvoice ? '3px solid #3b82f6' : '3px solid #c084fc'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: isInvoice ? 'rgba(59, 130, 246, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                          color: isInvoice ? '#60a5fa' : '#c084fc',
                          fontSize: '0.72rem',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {q.type} #{q.id}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.2rem 0 0 0', color: 'var(--text-primary)' }}>
                        {q.companyName || 'Unnamed Client'}
                      </h4>
                    </div>

                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                        color: isPaid ? '#34d399' : '#fbbf24',
                        fontSize: '0.72rem'
                      }}
                    >
                      {q.paymentStatus}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    Attn: <strong>{q.customerName}</strong> • {q.phone}
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div 
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span>Subtotal ({q.items?.length || 0} items):</span>
                      <span style={{ fontFamily: 'monospace' }}>{currency}{Number(q.subtotal || 0).toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      <span>GST (18%):</span>
                      <span style={{ fontFamily: 'monospace' }}>{currency}{Number(q.taxAmount || 0).toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', fontWeight: 800, fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Grand Total:</span>
                      <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{currency}{Number(q.grandTotal || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Dates & Payment History */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <span>Date: <strong>{q.date}</strong></span>
                    <span>{isInvoice ? 'Due:' : 'Valid:'} <strong>{q.validUntil}</strong></span>
                  </div>
                </div>

                {/* Actions Row */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActivePrintQuote(q)}
                    title="View & Print PDF"
                  >
                    <Printer size={14} /> PDF / Print
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {!isInvoice && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => convertQuotationToInvoice(q.id)}
                        title="Convert Quotation to Invoice"
                      >
                        ➔ Invoice
                      </button>
                    )}

                    {isInvoice && !isPaid && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setPaymentModalQuote(q);
                          setPayAmount(String(q.grandTotal));
                        }}
                        title="Record Payment"
                      >
                        <CreditCard size={14} /> Pay
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-icon btn-secondary btn-sm"
                      onClick={() => {
                        if (window.confirm(`Delete ${q.type} #${q.id}?`)) {
                          deleteQuotation(q.id);
                        }
                      }}
                      title="Delete"
                    >
                      <Trash2 size={14} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE QUOTATION / INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div 
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    Create {docType} (GST Invoice / Estimate)
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Add billable items, calculate 18% GST, and export PDF
                  </p>
                </div>
              </div>
              <button type="button" className="btn-icon btn-secondary btn-sm" onClick={() => setIsCreateModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation}>
              <div className="modal-body">
                {/* 1. Document Type Picker */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setDocType('Quotation')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: docType === 'Quotation' ? 'rgba(192, 132, 252, 0.15)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${docType === 'Quotation' ? '#c084fc' : 'var(--border-subtle)'}`,
                      color: docType === 'Quotation' ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Quotation / Estimate
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocType('Invoice')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: docType === 'Invoice' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${docType === 'Invoice' ? '#3b82f6' : 'var(--border-subtle)'}`,
                      color: docType === 'Invoice' ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Tax Invoice (GST)
                  </button>
                </div>

                {/* 2. Customer Autocomplete Selector */}
                <div className="form-group">
                  <label className="form-label">Auto-populate from Existing Customer</label>
                  <select
                    className="form-input"
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                  >
                    <option value="">-- Choose Customer or Enter Below --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName || c.customerName} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Client Details Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Innovations Pvt Ltd"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{docType === 'Invoice' ? 'Due Date' : 'Valid Until'}</label>
                    <input
                      type="date"
                      className="form-input"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Billing Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Office / Street, City, State"
                  />
                </div>

                {/* 4. Products Quick Insert */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Quick Insert from Catalog:
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddItem(p)}
                        style={{
                          fontSize: '0.74rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: '#60a5fa',
                          cursor: 'pointer'
                        }}
                      >
                        + {p.name} ({currency}{p.price.toLocaleString()})
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Line Items Builder */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                      Itemized Line Items
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddItem(null)}
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map((item, index) => (
                      <div 
                        key={item.id || index}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 80px 120px 100px 36px',
                          gap: '0.5rem',
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          padding: '0.5rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                          placeholder="Item Description"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                          required
                        />

                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', textAlign: 'center' }}
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(index, 'qty', e.target.value)}
                          required
                        />

                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', textAlign: 'right' }}
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleUpdateItem(index, 'rate', e.target.value)}
                          required
                        />

                        <div style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.88rem' }}>
                          {currency}{Number(item.amount).toLocaleString()}
                        </div>

                        <button
                          type="button"
                          className="btn-icon btn-secondary btn-sm"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                        >
                          <Trash2 size={14} style={{ color: '#f87171' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Pricing, GST & Totals Box */}
                <div 
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '1.5rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <div>
                    <label className="form-label">Terms & Conditions</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{currency}{subtotal.toLocaleString()}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Discount (%):</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-input"
                        style={{ width: '80px', padding: '0.25rem 0.5rem', textAlign: 'right', fontSize: '0.82rem' }}
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>GST Rate:</span>
                      <select
                        className="form-input"
                        style={{ width: '110px', padding: '0.25rem 0.5rem', fontSize: '0.82rem' }}
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                      >
                        <option value="18">18% (Standard)</option>
                        <option value="12">12%</option>
                        <option value="5">5%</option>
                        <option value="0">0% (Nil)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>CGST + SGST:</span>
                      <span style={{ fontFamily: 'monospace' }}>{currency}{taxAmount.toLocaleString()}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--border-medium)', paddingTop: '0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                      <span style={{ color: 'var(--text-primary)' }}>Grand Total:</span>
                      <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{currency}{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckCircle size={17} /> Save & Generate {docType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalQuote && (
        <div className="modal-overlay" onClick={() => setPaymentModalQuote(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div 
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Record Payment</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Invoice #{paymentModalQuote.id} ({paymentModalQuote.companyName})
                  </p>
                </div>
              </div>
              <button type="button" className="btn-icon btn-secondary btn-sm" onClick={() => setPaymentModalQuote(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePayment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Amount Paid ({currency}) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode *</label>
                  <select
                    className="form-input"
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Transaction Reference # / Cheque No.</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. UPI-928472910 or HDFC00912"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModalQuote(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!payAmount}>
                  <CheckCircle size={16} /> Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT / DOWNLOAD PDF MODAL */}
      {activePrintQuote && (
        <QuotationPrintModal
          quote={activePrintQuote}
          onClose={() => setActivePrintQuote(null)}
          onRecordPayment={(q) => {
            setPaymentModalQuote(q);
            setPayAmount(String(q.grandTotal));
          }}
        />
      )}
    </div>
  );
};

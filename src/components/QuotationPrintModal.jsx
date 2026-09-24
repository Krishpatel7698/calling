import React from 'react';
import { useCustomers } from '../context/CustomerContext';
import { Printer, Download, X, Building2, CheckCircle, ArrowRight } from 'lucide-react';

export const QuotationPrintModal = ({ quote, onClose, onRecordPayment }) => {
  const { companySettings, convertQuotationToInvoice } = useCustomers();

  if (!quote) return null;

  const isInvoice = quote.type === 'Invoice';
  const currency = companySettings.currency || '₹';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '850px', maxHeight: '92vh', overflowY: 'auto', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (hidden when printing) */}
        <div 
          className="no-print"
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span 
              className="status-badge"
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF'
              }}
            >
              {quote.type} #{quote.id}
            </span>
            <span 
              className="status-badge"
              style={{
                backgroundColor: quote.paymentStatus === 'Paid' 
                  ? 'var(--success-bg)' 
                  : 'var(--warning-bg)',
                color: quote.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)',
                borderColor: quote.paymentStatus === 'Paid' ? 'var(--success-border)' : 'var(--warning-border)'
              }}
            >
              {quote.paymentStatus}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isInvoice && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  convertQuotationToInvoice(quote.id);
                  onClose();
                }}
              >
                <ArrowRight size={15} /> Convert to Invoice
              </button>
            )}

            {isInvoice && quote.paymentStatus !== 'Paid' && onRecordPayment && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onRecordPayment(quote);
                }}
              >
                <CheckCircle size={15} /> Record Payment
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
            >
              <Printer size={15} /> Print / Save as PDF
            </button>

            <button
              type="button"
              className="btn-icon btn-secondary btn-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Printable Paper Document (Clean White Sheet for crisp printing & PDF export) */}
        <div 
          className="printable-invoice-container"
          style={{
            backgroundColor: '#ffffff',
            color: '#111111',
            padding: '2.5rem',
            fontFamily: 'Arial, -apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {/* Header Row: Company Details & Invoice/Quote Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E5E5E5', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', margin: '0 0 0.3rem 0' }}>
                {companySettings.companyName}
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#666666', margin: '0 0 0.25rem 0' }}>
                {companySettings.tagline}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#666666', margin: '0 0 0.2rem 0', maxWidth: '380px' }}>
                {companySettings.address}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#666666' }}>
                Phone: <strong>{companySettings.phone}</strong> | Email: <strong>{companySettings.email}</strong>
              </div>
              {companySettings.gstin && (
                <div style={{ fontSize: '0.8rem', color: '#111111', marginTop: '0.2rem' }}>
                  <strong>GSTIN / Tax ID:</strong> {companySettings.gstin}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#111111', color: '#ffffff', padding: '0.35rem 1rem', borderRadius: '4px', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {quote.type}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111111' }}>
                #{quote.id}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.35rem' }}>
                Date: <strong>{quote.date}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.15rem' }}>
                {isInvoice ? 'Due Date:' : 'Valid Until:'} <strong>{quote.validUntil}</strong>
              </div>
            </div>
          </div>

          {/* Billed To / Client Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '2rem' }}>
            <div style={{ flex: 1, backgroundColor: '#F7F7F7', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E5E5' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Billed To:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111' }}>
                {quote.companyName}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#111111', fontWeight: 600, marginTop: '0.2rem' }}>
                Attn: {quote.customerName}
              </div>
              {quote.address && (
                <div style={{ fontSize: '0.82rem', color: '#666666', marginTop: '0.2rem' }}>
                  {quote.address}
                </div>
              )}
              <div style={{ fontSize: '0.82rem', color: '#666666', marginTop: '0.3rem' }}>
                {quote.phone} • {quote.email}
              </div>
            </div>

            <div style={{ width: '220px', backgroundColor: '#F7F7F7', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E5E5' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Payment Status:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: quote.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>
                {quote.paymentStatus}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#666666', marginTop: '0.25rem' }}>
                Currency: <strong>{currency} (INR)</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#111111', color: '#ffffff', textAlign: 'left', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 1rem', width: '50px' }}>#</th>
                <th style={{ padding: '0.75rem 1rem' }}>Item Description</th>
                <th style={{ padding: '0.75rem 1rem', width: '80px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.75rem 1rem', width: '120px', textAlign: 'right' }}>Rate ({currency})</th>
                <th style={{ padding: '0.75rem 1rem', width: '130px', textAlign: 'right' }}>Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={item.id || index} style={{ borderBottom: '1px solid #E5E5E5', fontSize: '0.88rem' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#666666' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#111111' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#666666' }}>
                    {item.qty}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#666666', fontFamily: 'monospace' }}>
                    {Number(item.rate).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#111111', fontFamily: 'monospace' }}>
                    {Number(item.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Tax Calculation Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            {/* Bank details & Terms */}
            <div style={{ maxWidth: '420px', fontSize: '0.8rem', color: '#666666' }}>
              <div style={{ fontWeight: 700, color: '#111111', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                Bank & Payment Details:
              </div>
              <div>Bank: <strong>{companySettings.bankName}</strong></div>
              <div>A/C Number: <strong>{companySettings.accountNumber}</strong></div>
              <div>IFSC Code: <strong>{companySettings.ifscCode}</strong></div>

              <div style={{ fontWeight: 700, color: '#111111', marginTop: '0.8rem', marginBottom: '0.2rem', fontSize: '0.85rem' }}>
                Terms & Notes:
              </div>
              <div style={{ whiteSpace: 'pre-line', color: '#666666', fontSize: '0.75rem', lineHeight: 1.4 }}>
                {quote.notes || companySettings.invoiceTerms}
              </div>
            </div>

            {/* Price Calculations */}
            <div style={{ width: '280px', backgroundColor: '#F7F7F7', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666666', marginBottom: '0.4rem' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600, color: '#111111', fontFamily: 'monospace' }}>
                  {currency}{Number(quote.subtotal).toLocaleString()}
                </span>
              </div>

              {quote.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--success)', marginBottom: '0.4rem' }}>
                  <span>Discount ({quote.discountPercent}%):</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    -{currency}{Number(quote.discountAmount).toLocaleString()}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666666', marginBottom: '0.2rem' }}>
                <span>CGST (9%):</span>
                <span style={{ fontWeight: 600, color: '#111111', fontFamily: 'monospace' }}>
                  {currency}{(quote.taxAmount / 2).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666666', marginBottom: '0.6rem' }}>
                <span>SGST (9%):</span>
                <span style={{ fontWeight: 600, color: '#111111', fontFamily: 'monospace' }}>
                  {currency}{(quote.taxAmount / 2).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#111111', borderTop: '2px solid #111111', paddingTop: '0.6rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#111111', fontFamily: 'monospace' }}>
                  {currency}{Number(quote.grandTotal).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Authorization Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E5E5E5', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#666666' }}>
              Thank you for partnering with {companySettings.companyName}.<br />
              This is a computer-generated document.
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '40px' }} />
              <div style={{ borderTop: '1px solid #111111', width: '180px', paddingTop: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#111111' }}>
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

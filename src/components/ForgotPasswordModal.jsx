import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, X, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setResult(null);

    const res = await forgotPassword(email);
    setSubmitting(false);
    setResult(res);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
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
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Reset Password</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Enter your account email to receive reset instructions
              </p>
            </div>
          </div>
          <button type="button" className="btn-icon btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {result ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div 
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: result.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: result.success ? '#34d399' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              {result.success ? <CheckCircle size={26} /> : <AlertCircle size={26} />}
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', color: result.success ? '#34d399' : '#f87171' }}>
              {result.success ? 'Reset Link Dispatched' : 'Request Failed'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {result.message || result.error}
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">
                  Registered Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. admin@calling.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail 
                    size={17}
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
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || !email.trim()}>
                {submitting ? 'Sending Link...' : 'Send Password Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

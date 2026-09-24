import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { 
  PhoneCall, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  UserPlus, 
  LogIn, 
  ShieldCheck,
  User,
  KeyRound,
  Shield
} from 'lucide-react';

export const Login = () => {
  const { login, signup, isFirebaseConnected } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('Sales Executive');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      const result = await signup(email.trim(), password, displayName, selectedRole);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    } else {
      setIsSubmitting(true);
      const result = await login(email.trim(), password);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your login details.');
      }
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#F7F7F7',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #E5E5E5',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div 
            style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#111111',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '0.85rem'
            }}
          >
            {isSignUp ? <UserPlus size={26} /> : <PhoneCall size={26} />}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', color: '#111111' }}>
            {isSignUp ? 'Staff Registration' : 'CallPulse CRM'}
          </h2>
          <p style={{ color: '#666666', fontSize: '0.88rem' }}>
            {isSignUp ? 'Create staff or admin account' : 'Customer Calling, Sales Pipeline & Billing'}
          </p>

          {/* Connection Status Pill */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.65rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isFirebaseConnected ? 'rgba(22, 163, 74, 0.1)' : '#FFFFFF',
              color: isFirebaseConnected ? '#16a34a' : '#666666',
              border: '1px solid #E5E5E5',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <span 
              className="status-badge-dot" 
              style={{ backgroundColor: isFirebaseConnected ? '#16a34a' : '#666666' }} 
            />
            {isFirebaseConnected ? 'Cloud Firestore Connected' : 'Local CRM Mode'}
          </div>
        </div>

        {/* Quick Demo Role Fillers (Admin Login vs Employee/Staff Login) */}
        {!isSignUp && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem' }}>
              ⚡ 1-Click Role Login:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@calling.com', 'admin123')}
                style={{
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#111111',
                  border: '1px solid #111111',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                👑 Master Admin
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('rahul@calling.com', 'rahul123')}
                style={{
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#F7F7F7',
                  border: '1px solid #E5E5E5',
                  color: '#111111',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                💼 Sales (Rahul)
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('priya@calling.com', 'priya123')}
                style={{
                  padding: '0.4rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#F7F7F7',
                  border: '1px solid #E5E5E5',
                  color: '#111111',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🎧 Staff (Priya)
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
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="staff-name">
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="staff-name"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                  <User 
                    size={17}
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Assigned Role & Permission
                </label>
                <select
                  className="form-input"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="user-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="user-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail 
                size={17} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: isSignUp ? '1rem' : '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" htmlFor="user-password" style={{ margin: 0 }}>
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="user-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock 
                size={17} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
              />
            </div>
          </div>

          {/* Confirm Password for signup */}
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="user-confirm-password">
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="user-confirm-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <ShieldCheck 
                  size={17} 
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            disabled={isSubmitting}
            id="auth-submit-btn"
          >
            {isSubmitting ? (
              isSignUp ? 'Creating account...' : 'Signing in...'
            ) : (
              <>
                <span>{isSignUp ? 'Create Staff Account' : 'Sign in to CRM'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Registration */}
        <div 
          style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.25rem', 
            borderTop: '1px solid var(--border-subtle)', 
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}
        >
          {isSignUp ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Register Staff
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};

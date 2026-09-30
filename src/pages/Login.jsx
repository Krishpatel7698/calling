import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PhoneCall, Lock, Mail, ArrowRight, AlertCircle, UserPlus, LogIn, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { login, signup, isFirebaseConnected } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      const result = await signup(email.trim(), password);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account. Please check Firebase settings.');
      }
    } else {
      setIsSubmitting(true);
      const result = await login(email.trim(), password);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in. Please check your Firebase credentials.');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #090d16 100%)'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div 
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              marginBottom: '1rem'
            }}
          >
            {isSignUp ? <UserPlus size={28} /> : <PhoneCall size={28} />}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            {isSignUp ? 'Create Admin Account' : 'CallPulse CRM'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isSignUp ? 'Register initial admin user in Firebase' : 'Customer Calling & Lead Management'}
          </p>

          {/* Connection Mode Pill */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isFirebaseConnected ? '#34d399' : '#f87171',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <span 
              className="status-badge-dot" 
              style={{ backgroundColor: isFirebaseConnected ? '#34d399' : '#f87171' }} 
            />
            {isFirebaseConnected ? 'Firebase Online (.env)' : 'Firebase Disconnected'}
          </div>
        </div>

        {/* Warning if Firebase credentials are not set in .env */}
        {!isFirebaseConnected && (
          <div 
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--text-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              lineHeight: 1.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#f87171', marginBottom: '0.4rem' }}>
              <AlertCircle size={17} />
              <span>Firebase Credentials Required in .env</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              Credentials must be placed in the project root <code>.env</code> file:
            </p>
            <pre
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                color: '#93c5fd',
                overflowX: 'auto',
                fontFamily: 'monospace',
                marginBottom: 0
              }}
            >
{`VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id`}
            </pre>
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

        {/* Quick Demo Credentials Box */}
        <div
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              🔑 Default Admin Login
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@calling.com');
                setPassword('admin123');
              }}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#60a5fa',
                borderRadius: '6px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚡ Fill Credentials
            </button>
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45, fontFamily: 'monospace', fontSize: '0.78rem' }}>
            <div>ID/Email: <strong style={{ color: '#f1f5f9' }}>admin@calling.com</strong></div>
            <div>Password: <strong style={{ color: '#f1f5f9' }}>admin123</strong></div>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail 
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

          <div className="form-group" style={{ marginBottom: isSignUp ? '1rem' : '1.5rem' }}>
            <label className="form-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock 
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

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="admin-confirm-password">
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-confirm-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <ShieldCheck 
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
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isSubmitting || !isFirebaseConnected}
            id="auth-submit-btn"
          >
            {isSubmitting ? (
              isSignUp ? 'Creating account...' : 'Signing in...'
            ) : (
              <>
                <span>{isSignUp ? 'Create Admin Account' : 'Sign in to CRM'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
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
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an admin account yet?{' '}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

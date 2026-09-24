import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';
import { User, X, Phone, Mail, Shield, CheckCircle } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useCustomers();

  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    updateProfile({
      displayName: name.trim(),
      phone: phone.trim()
    });
    setIsSubmitting(false);
    showToast('Profile updated successfully', 'success');
    onClose();
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
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Profile Management</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {currentUser.role} Account Details
              </p>
            </div>
          </div>
          <button type="button" className="btn-icon btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Account Role Badge */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned Role:</span>
              </div>
              <span 
                className="status-badge"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa'
                }}
              >
                {currentUser.role || 'Admin'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User 
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

            <div className="form-group">
              <label className="form-label">
                Email Address (Read-only)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', opacity: 0.7 }}
                  value={currentUser.email || ''}
                  disabled
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="profile-phone">
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-phone"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Phone 
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <CheckCircle size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

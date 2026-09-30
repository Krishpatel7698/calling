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
  CheckCircle
} from 'lucide-react';

export const Settings = () => {
  const { isFirebaseConnected } = useAuth();
  const { customers, showToast } = useCustomers();

  const currentConfig = getActiveFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    messagingSenderId: '',
    appId: ''
  };

  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedEnvSnippet, setCopiedEnvSnippet] = useState(false);

  // Test current .env Firebase Connection Live
  const handleTestConnection = async () => {
    if (!currentConfig.apiKey || !currentConfig.projectId) {
      setTestResult({ 
        success: false, 
        message: 'No credentials detected. Please define VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your .env file.' 
      });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    const res = await testFirebaseCredentials(currentConfig);
    setTestingConnection(false);
    setTestResult(res);
  };

  // Export customers to CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      showToast('No customer records in Firestore to export', 'info');
      return;
    }

    const headers = ['ID', 'Company Name', 'Customer Name', 'Phone', 'Project Type', 'Has Project', 'Date Added', 'Notes'];
    const rows = customers.map((c) => [
      `"${c.id}"`,
      `"${(c.companyName || '').replace(/"/g, '""')}"`,
      `"${(c.customerName || c.name || '').replace(/"/g, '""')}"`,
      `"${c.phone || ''}"`,
      `"${c.projectType || ''}"`,
      `"${c.hasProject ? 'Yes' : 'No'}"`,
      `"${c.createdAt || c.dateAdded || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `callpulse_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer data exported to CSV successfully', 'success');
  };

  // Copy firestore.rules
  const copyRules = () => {
    const rulesText = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /customers/{customerId} {\n      allow read, write: if request.auth != null;\n    }\n    match /call_logs/{logId} {\n      allow read, write: if request.auth != null;\n    }\n  }\n}`;
    navigator.clipboard.writeText(rulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_FIREBASE_API_KEY=your_api_key_here\nVITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your_project_id\nVITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id\nVITE_FIREBASE_APP_ID=your_app_id`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnvSnippet(true);
    setTimeout(() => setCopiedEnvSnippet(false), 2500);
  };

  // Helper to safely mask keys
  const maskValue = (val) => {
    if (!val) return null;
    if (val.length <= 8) return '••••••••';
    return val.substring(0, 6) + '••••••••' + val.substring(val.length - 4);
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>System Settings & Firebase Credentials</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Environment configuration status, Firestore rules, and data export
        </p>
      </div>

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
          background: isFirebaseConnected 
            ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(17, 24, 39, 0.8))'
            : 'linear-gradient(135deg, rgba(120, 53, 15, 0.4), rgba(17, 24, 39, 0.8))',
          borderColor: isFirebaseConnected ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 191, 36, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: isFirebaseConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isFirebaseConnected ? '#34d399' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isFirebaseConnected ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isFirebaseConnected ? '#34d399' : '#fbbf24' }}>
              {isFirebaseConnected ? 'Connected to Firebase Firestore' : 'Firebase Disconnected / Not Configured'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {isFirebaseConnected 
                ? `Active Firebase Project: ${currentConfig.projectId} (Loaded via .env)`
                : 'Credentials are read from your root .env file. Add your Firebase keys and restart Vite.'}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleTestConnection}
          disabled={testingConnection}
        >
          {testingConnection ? 'Testing Connection...' : 'Test Connection'}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Environment Variables Inspection Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode size={18} style={{ color: '#3b82f6' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>.env Configuration Status</h3>
            </div>
            <button
              type="button"
              onClick={copyEnvSnippet}
              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
            >
              {copiedEnvSnippet ? <Check size={13} /> : <Copy size={13} />}
              {copiedEnvSnippet ? 'Copied' : 'Copy Template'}
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Credentials are kept in the project root <code>.env</code> file:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_API_KEY</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: currentConfig.apiKey ? '#34d399' : '#f87171' }}>
                {maskValue(currentConfig.apiKey) || 'Not set'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_PROJECT_ID</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: currentConfig.projectId ? '#34d399' : '#f87171' }}>
                {currentConfig.projectId || 'Not set'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_AUTH_DOMAIN</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: currentConfig.authDomain ? '#34d399' : 'var(--text-tertiary)' }}>
                {currentConfig.authDomain || 'Default'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_MESSAGING_SENDER_ID</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: currentConfig.messagingSenderId ? '#34d399' : 'var(--text-tertiary)' }}>
                {currentConfig.messagingSenderId || 'Default'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>VITE_FIREBASE_APP_ID</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: currentConfig.appId ? '#34d399' : 'var(--text-tertiary)' }}>
                {maskValue(currentConfig.appId) || 'Not set'}
              </span>
            </div>

          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
            💡 To update credentials, edit <code>.env</code> directly in your code editor.
          </div>
        </div>

        {/* Step-by-Step Firebase Instructions */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Connecting Your Firebase</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Step 1: Firebase Project</strong>
              <p style={{ marginTop: '0.2rem' }}>
                Create a project in the <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Firebase Console</a>.
              </p>
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Step 2: Enable Auth & Firestore</strong>
              <p style={{ marginTop: '0.2rem' }}>
                1. Click <strong>Authentication</strong> &gt; enable <strong>Email/Password</strong>.<br />
                2. Click <strong>Firestore Database</strong> &gt; <strong>Create database</strong>.
              </p>
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Step 3: Add to .env</strong>
              <p style={{ marginTop: '0.2rem' }}>
                Under <em>Project Settings</em> &gt; <em>General</em> &gt; <em>Your Apps</em>, copy your web configuration and paste into <code>.env</code>.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Firestore Security Rules</span>
                <button
                  type="button"
                  onClick={copyRules}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                >
                  {copiedRules ? <Check size={13} /> : <Copy size={13} />}
                  {copiedRules ? 'Copied' : 'Copy Rules'}
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                Copy the rules from <code>firestore.rules</code> into your Firebase Console under Firestore Database &gt; Rules.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Data Management & Backups */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Database size={18} style={{ color: '#c084fc' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data Operations & Backups</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Export Leads to CSV</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Download all {customers.length} customer records, phone numbers, and notes directly from Cloud Firestore to a spreadsheet.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

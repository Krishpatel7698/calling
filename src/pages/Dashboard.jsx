import React from 'react';
import { useCustomers } from '../context/CustomerContext';
import { StatsCard } from '../components/StatsCard';
import { ProjectBadge, ProjectTypeBadge } from '../components/StatusBadge';
import { 
  Building2, 
  UserPlus, 
  Phone, 
  Smartphone, 
  Globe, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Dashboard = ({ setActivePage, onViewDetails }) => {
  const { customers, stats, initiateCall, setProjectFilter } = useCustomers();

  const recentCustomers = customers.slice(0, 5);
  const nextTargetCustomer = customers.find((c) => c.hasProject) || customers[0];

  const handleFilterNavigate = (filterId) => {
    setProjectFilter(filterId);
    setActivePage('customers');
  };

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(17, 24, 39, 0.9))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Customer & Project Inquiry Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Track client development requirements, phone numbers, and call directly from mobile.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {nextTargetCustomer && (
            <a
              href={`tel:${nextTargetCustomer.phone.replace(/[^0-9+]/g, '')}`}
              className="btn btn-call"
              title={`Call ${nextTargetCustomer.companyName || nextTargetCustomer.customerName}`}
              id="dash-quick-call-btn"
            >
              <Phone size={16} />
              <span>Call ({nextTargetCustomer.companyName || nextTargetCustomer.customerName})</span>
            </a>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('add-customer')}
            id="dash-add-customer-btn"
          >
            <UserPlus size={15} />
            <span>Add Inquiry</span>
          </button>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div className="stats-grid">
        <div onClick={() => handleFilterNavigate('All')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Total Inquiries"
            count={stats.total}
            icon={Building2}
            type="total"
            subtitle="All recorded leads"
          />
        </div>

        <div onClick={() => handleFilterNavigate('Yes')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Projects (Yes)"
            count={stats.withProject}
            icon={CheckCircle2}
            type="converted"
            subtitle={`${stats.projectRate}% project interest`}
          />
        </div>

        <div onClick={() => handleFilterNavigate('No')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="No Project"
            count={stats.withoutProject}
            icon={XCircle}
            type="not-interested"
            subtitle="General inquiries"
          />
        </div>

        <div onClick={() => handleFilterNavigate('Mobile App')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Mobile Apps"
            count={stats.mobileApps}
            icon={Smartphone}
            type="new"
            subtitle="iOS / Android"
          />
        </div>

        <div onClick={() => handleFilterNavigate('Website')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Websites"
            count={stats.websites}
            icon={Globe}
            type="interested"
            subtitle="Web portals & sites"
          />
        </div>

        <div onClick={() => handleFilterNavigate('CRM')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="CRM & ERP"
            count={stats.crms + stats.erps}
            icon={Briefcase}
            type="called"
            subtitle={`${stats.crms} CRM • ${stats.erps} ERP`}
          />
        </div>
      </div>

      {/* Two Column Layout: Project Type Distribution & Recent Inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Left: Project Types Overview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Development Project Types</h3>
            </div>
            <button
              type="button"
              onClick={() => handleFilterNavigate('Yes')}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Mobile App Bar */}
            <div onClick={() => handleFilterNavigate('Mobile App')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Smartphone size={14} style={{ color: '#38bdf8' }} /> Mobile App
                </span>
                <span style={{ fontWeight: 600 }}>{stats.mobileApps} requests</span>
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${stats.total > 0 ? (stats.mobileApps / stats.total) * 100 : 0}%`, height: '100%', backgroundColor: '#38bdf8' }} />
              </div>
            </div>

            {/* Website Bar */}
            <div onClick={() => handleFilterNavigate('Website')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={14} style={{ color: '#c084fc' }} /> Website
                </span>
                <span style={{ fontWeight: 600 }}>{stats.websites} requests</span>
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${stats.total > 0 ? (stats.websites / stats.total) * 100 : 0}%`, height: '100%', backgroundColor: '#c084fc' }} />
              </div>
            </div>

            {/* CRM Bar */}
            <div onClick={() => handleFilterNavigate('CRM')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={14} style={{ color: '#fbbf24' }} /> CRM System
                </span>
                <span style={{ fontWeight: 600 }}>{stats.crms} requests</span>
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${stats.total > 0 ? (stats.crms / stats.total) * 100 : 0}%`, height: '100%', backgroundColor: '#fbbf24' }} />
              </div>
            </div>

            {/* ERP Bar */}
            <div onClick={() => handleFilterNavigate('ERP')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={14} style={{ color: '#f43f5e' }} /> ERP System
                </span>
                <span style={{ fontWeight: 600 }}>{stats.erps} requests</span>
              </div>
              <div style={{ height: 8, backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${stats.total > 0 ? (stats.erps / stats.total) * 100 : 0}%`, height: '100%', backgroundColor: '#f43f5e' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Inquiries */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: '#34d399' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Inquiries</h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('customers')}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentCustomers.map((c) => {
              const cleanPhone = (c.phone || '').replace(/[^0-9+]/g, '');
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.85rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                      {c.companyName || 'Unnamed Company'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {c.customerName || c.name} • {c.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {c.hasProject ? (
                      <ProjectTypeBadge type={c.projectType} />
                    ) : (
                      <ProjectBadge hasProject={false} />
                    )}

                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn btn-call btn-sm btn-icon"
                      title="Call Customer"
                    >
                      <Phone size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

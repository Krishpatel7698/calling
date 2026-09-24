import React from 'react';
import { useCustomers } from '../context/CustomerContext';
import { StatsCard } from '../components/StatsCard';
import { ProjectBadge, ProjectTypeBadge } from '../components/StatusBadge';
import { 
  Building2, 
  UserPlus, 
  Phone, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  MessageCircle,
  Award
} from 'lucide-react';

export const Dashboard = ({ setActivePage, onViewDetails }) => {
  const { 
    customers, 
    stats, 
    initiateCall, 
    setProjectFilter, 
    companySettings 
  } = useCustomers();

  const currency = companySettings.currency || '₹';
  const recentCustomers = customers.slice(0, 5);

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
          backgroundColor: '#F7F7F7',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #E5E5E5'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', backgroundColor: '#111111', color: '#FFFFFF' }}>
              CRM Live
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: '#666666' }}>
              {companySettings.companyName}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111111' }}>Sales Calling & Operations Dashboard</h2>
          <p style={{ color: '#666666', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Real-time pipeline metrics, follow-up alarms, won deals, and agent performance
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('pipeline')}
          >
            <TrendingUp size={15} />
            <span>Sales Pipeline</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('add-customer')}
            id="dash-add-customer-btn"
          >
            <UserPlus size={15} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards (as specifically requested in requirements) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* 1. Total Leads */}
        <div onClick={() => handleFilterNavigate('All')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Total Leads"
            count={stats.total}
            icon={Building2}
            type="total"
            subtitle="All captured inquiries"
          />
        </div>

        {/* 2. New Leads */}
        <div onClick={() => handleFilterNavigate('New Lead')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="New Leads"
            count={stats.newLeads}
            icon={UserPlus}
            type="new"
            subtitle="Pending initial contact"
          />
        </div>

        {/* 3. Converted / Won Leads */}
        <div onClick={() => handleFilterNavigate('Won')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Converted (Won)"
            count={stats.converted}
            icon={CheckCircle2}
            type="converted"
            subtitle="Deals closed successfully"
          />
        </div>

        {/* 4. Lost Leads */}
        <div onClick={() => handleFilterNavigate('Lost')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Lost Leads"
            count={stats.lost}
            icon={XCircle}
            type="not-interested"
            subtitle="Closed lost / declined"
          />
        </div>

        {/* 5. Total Customers */}
        <div onClick={() => handleFilterNavigate('Yes')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Active Customers"
            count={stats.withProject}
            icon={Users}
            type="interested"
            subtitle={`${stats.projectRate}% project confirmation`}
          />
        </div>

        {/* 6. Pending Follow-ups */}
        <div onClick={() => setActivePage('customers')} style={{ cursor: 'pointer' }}>
          <StatsCard
            title="Pending Follow-ups"
            count={stats.pendingFollowUps}
            icon={Clock}
            type="called"
            subtitle="Due today or overdue"
          />
        </div>

        {/* 7. Sales Revenue Amount */}
        <div 
          onClick={() => setActivePage('quotations')}
          className="stat-card"
          style={{
            cursor: 'pointer',
            backgroundColor: '#F7F7F7',
            border: '1px solid #E5E5E5',
            borderTop: '3px solid #16a34a'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="stat-title" style={{ color: '#16a34a' }}>Won Sales Amount</span>
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={16} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#16a34a', fontFamily: 'monospace', fontSize: '1.6rem' }}>
            {currency}{stats.totalSalesAmount.toLocaleString()}
          </div>
          <span className="stat-subtitle" style={{ color: '#666666' }}>
            Pipeline: {currency}{stats.totalPipelineAmount.toLocaleString()}
          </span>
        </div>

        {/* 8. Pipeline Health */}
        <div 
          onClick={() => setActivePage('pipeline')}
          className="stat-card"
          style={{
            cursor: 'pointer',
            backgroundColor: '#F7F7F7',
            border: '1px solid #E5E5E5',
            borderTop: '3px solid #111111'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span className="stat-title" style={{ color: '#111111' }}>Active Pipeline</span>
            <div 
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                color: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#111111' }}>
            {stats.contactedLeads + stats.interestedLeads + stats.proposalLeads + stats.negotiationLeads}
          </div>
          <span className="stat-subtitle" style={{ color: '#666666' }}>
            Deals currently in progress
          </span>
        </div>
      </div>

      {/* Today's Pending Follow-ups Action Block */}
      {stats.pendingFollowUpList.length > 0 && (
        <div 
          className="card"
          style={{
            marginBottom: '1.75rem',
            backgroundColor: '#F7F7F7',
            border: '1px solid #E5E5E5',
            borderLeft: '4px solid #ea580c'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div 
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(234, 88, 12, 0.1)',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111', margin: 0 }}>
                  Urgent Follow-ups Due Today ({stats.pendingFollowUpList.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#666666' }}>
                  Call these prospective clients today to maintain conversion momentum
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('customers')}
            >
              View in Lead List <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {stats.pendingFollowUpList.slice(0, 3).map((item) => {
              const cleanPhone = (item.phone || '').replace(/[^0-9+]/g, '');

              return (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                      {item.companyName || item.customerName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {item.customerName} • {item.phone}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '0.2rem' }}>
                      Time: {item.followUpTime || '11:00'} ({item.assignedTo || 'Master Admin'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn btn-call btn-sm btn-icon"
                      title="Call directly"
                    >
                      <Phone size={14} />
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hello ${item.customerName || ''}, following up from ${companySettings.companyName}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm btn-icon"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Section: Employee-wise Performance & Recent Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Module 7: Employee-wise performance */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: '#fbbf24' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Employee-wise Performance</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Monthly Leaderboard
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.employeeStats.map((emp) => (
              <div 
                key={emp.name}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div 
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {emp.name[0]}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {emp.name}
                    </span>
                  </div>

                  <span style={{ fontWeight: 700, color: '#34d399', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {currency}{emp.revenue.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>Assigned: <strong>{emp.assignedCount} leads</strong></span>
                  <span>Won: <strong>{emp.wonCount} deals</strong></span>
                  <span>Calls: <strong>{emp.callsMade}</strong></span>
                  <span style={{ color: '#60a5fa' }}>Conv: <strong>{emp.conversionRate}%</strong></span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, backgroundColor: 'var(--bg-surface)', borderRadius: 3, marginTop: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, emp.conversionRate * 2 || 10)}%`, height: '100%', backgroundColor: '#34d399' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries and Direct Calling */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Leads & Direct Dial</h3>
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
                  <div 
                    style={{ overflow: 'hidden', cursor: 'pointer', flex: 1 }}
                    onClick={() => onViewDetails && onViewDetails(c)}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {c.companyName || 'Unnamed Company'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {c.customerName || c.name} • {c.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span 
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        fontWeight: 600
                      }}
                    >
                      {c.leadStatus || c.status}
                    </span>

                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn btn-call btn-sm btn-icon"
                      title="Call Client"
                    >
                      <Phone size={13} />
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

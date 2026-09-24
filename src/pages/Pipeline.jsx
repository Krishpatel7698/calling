import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  Building2, 
  Phone, 
  User, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Search,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'New Lead', label: 'New Leads', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  { id: 'Contacted', label: 'Contacted', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  { id: 'Interested', label: 'Interested', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
  { id: 'Proposal', label: 'Proposal Sent', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
  { id: 'Negotiation', label: 'In Negotiation', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)' },
  { id: 'Won', label: 'Won / Closed 🏆', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' }
];

export const Pipeline = ({ setActivePage, onViewDetails }) => {
  const { 
    customers, 
    moveLeadStage, 
    initiateCall, 
    companySettings 
  } = useCustomers();

  const [staffFilter, setStaffFilter] = useState('All');
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [showLostColumn, setShowLostColumn] = useState(false);

  const currency = companySettings.currency || '₹';

  // Filter leads
  const filteredLeads = customers.filter((c) => {
    if (staffFilter !== 'All' && (c.assignedTo || 'Master Admin') !== staffFilter) return false;
    if (pipelineSearch.trim()) {
      const q = pipelineSearch.toLowerCase();
      const matchCompany = (c.companyName || '').toLowerCase().includes(q);
      const matchCustomer = (c.customerName || '').toLowerCase().includes(q);
      const matchType = (c.projectType || '').toLowerCase().includes(q);
      return matchCompany || matchCustomer || matchType;
    }
    return true;
  });

  // Calculate totals per stage
  const getStageLeads = (stageId) => {
    return filteredLeads.filter((c) => {
      const status = c.leadStatus || c.status || 'New Lead';
      if (stageId === 'New Lead') return status === 'New Lead' || status === 'New';
      if (stageId === 'Contacted') return status === 'Contacted' || status === 'Called';
      if (stageId === 'Won') return status === 'Won' || status === 'Converted';
      if (stageId === 'Lost') return status === 'Lost' || status === 'Not Interested';
      return status === stageId;
    });
  };

  const getStageTotalValue = (stageId) => {
    const list = getStageLeads(stageId);
    return list.reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);
  };

  const stagesToRender = showLostColumn 
    ? [...PIPELINE_STAGES, { id: 'Lost', label: 'Lost / Closed', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' }]
    : PIPELINE_STAGES;

  return (
    <div className="page-container" style={{ maxWidth: '100%' }}>
      {/* Header and Controls */}
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Sales Pipeline & Kanban Board</span>
            <span 
              className="status-badge"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.8rem' }}
            >
              {filteredLeads.length} Total Deals
            </span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track client journeys from Initial Inquiry to Deal Won
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Quick Search */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem',
              gap: '0.5rem',
              width: 190
            }}
          >
            <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Filter deals..."
              value={pipelineSearch}
              onChange={(e) => setPipelineSearch(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', width: '100%' }}
            />
          </div>

          {/* Assigned Staff Filter */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.82rem'
            }}
          >
            <option value="All">All Staff / Reps</option>
            <option value="Master Admin">Master Admin</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Patel">Priya Patel</option>
          </select>

          <button
            type="button"
            className={`btn btn-sm ${showLostColumn ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowLostColumn(!showLostColumn)}
          >
            {showLostColumn ? 'Hide Lost' : 'Show Lost'}
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="kanban-board">
        {stagesToRender.map((stage, stageIndex) => {
          const stageLeads = getStageLeads(stage.id);
          const totalVal = getStageTotalValue(stage.id);

          return (
            <div key={stage.id} className="kanban-column">
              {/* Column Header */}
              <div className="kanban-column-header" style={{ borderTop: `3px solid ${stage.color}` }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {stage.label}
                    </span>
                    <span 
                      style={{
                        backgroundColor: stage.bg,
                        color: stage.color,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {stageLeads.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Total: <strong style={{ color: stage.color }}>{currency}{totalVal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Column Body Cards */}
              <div className="kanban-column-body">
                {stageLeads.length === 0 ? (
                  <div 
                    style={{
                      textAlign: 'center',
                      padding: '2.5rem 1rem',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.82rem',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    No deals in this stage
                  </div>
                ) : (
                  stageLeads.map((deal) => {
                    const cleanPhone = (deal.phone || '').replace(/[^0-9+]/g, '');

                    return (
                      <div 
                        key={deal.id} 
                        className="kanban-card"
                        onClick={() => onViewDetails && onViewDetails(deal)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {deal.companyName || 'Unnamed Company'}
                          </h4>
                          {deal.projectType && (
                            <span 
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.45rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                color: '#60a5fa',
                                fontWeight: 600
                              }}
                            >
                              {deal.projectType}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem' }}>
                          <User size={13} />
                          <span>{deal.customerName || deal.name}</span>
                        </div>

                        {/* Deal Value & Close Date */}
                        <div 
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.45rem 0.65rem',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '0.75rem',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--text-tertiary)' }}>Value: </span>
                            <strong style={{ color: '#34d399', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                              {currency}{Number(deal.dealValue || 0).toLocaleString()}
                            </strong>
                          </div>

                          <div style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            <span>{deal.expectedCloseDate || 'Not set'}</span>
                          </div>
                        </div>

                        {/* Assigned Employee Tag */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          <span>Rep: <strong>{deal.assignedTo || 'Unassigned'}</strong></span>
                          <span>Source: <strong>{deal.leadSource || 'Website'}</strong></span>
                        </div>

                        {/* Card Actions: Call and Move to Next Stage */}
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid var(--border-subtle)',
                            gap: '0.5rem'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={`tel:${cleanPhone}`}
                            className="btn btn-call btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title="Call client"
                          >
                            <Phone size={13} /> Call
                          </a>

                          {/* Stage Transition Selector */}
                          <select
                            value={deal.leadStatus || stage.id}
                            onChange={(e) => moveLeadStage(deal.id, e.target.value)}
                            style={{
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.74rem',
                              padding: '0.25rem 0.4rem',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="New Lead">➔ New Lead</option>
                            <option value="Contacted">➔ Contacted</option>
                            <option value="Interested">➔ Interested</option>
                            <option value="Proposal">➔ Proposal</option>
                            <option value="Negotiation">➔ Negotiation</option>
                            <option value="Won">🏆 Won</option>
                            <option value="Lost">✖ Lost</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

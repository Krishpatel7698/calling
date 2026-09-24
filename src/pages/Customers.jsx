import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { CustomerCard } from '../components/CustomerCard';
import { CustomerTable } from '../components/CustomerTable';
import { 
  Search, 
  UserPlus, 
  LayoutGrid, 
  List, 
  X,
  PhoneCall,
  Briefcase,
  TrendingUp
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'All', label: 'All Leads' },
  { id: 'New Lead', label: 'New' },
  { id: 'Contacted', label: 'Contacted' },
  { id: 'Interested', label: 'Interested' },
  { id: 'Proposal', label: 'Proposal' },
  { id: 'Negotiation', label: 'Negotiation' },
  { id: 'Won', label: 'Won 🏆' },
  { id: 'Lost', label: 'Lost' },
  { id: 'Yes', label: 'With Project' }
];

export const Customers = ({ setActivePage, onViewDetails }) => {
  const { 
    filteredCustomers, 
    customers,
    searchQuery, 
    setSearchQuery, 
    projectFilter, 
    setProjectFilter,
    stats
  } = useCustomers();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' (cards) or 'table'

  const getCount = (tabId) => {
    switch (tabId) {
      case 'All': return stats.total;
      case 'New Lead': return stats.newLeads;
      case 'Contacted': return stats.contactedLeads;
      case 'Interested': return stats.interestedLeads;
      case 'Proposal': return stats.proposalLeads;
      case 'Negotiation': return stats.negotiationLeads;
      case 'Won': return stats.converted;
      case 'Lost': return stats.lost;
      case 'Yes': return stats.withProject;
      default: return 0;
    }
  };

  return (
    <div className="page-container">
      {/* Search & Actions Header */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Customer & Lead Management</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Showing {filteredCustomers.length} of {customers.length} total entries
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* View Mode Toggle (Grid Cards vs Table) */}
            <div 
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '2px'
              }}
            >
              <button
                type="button"
                className={`btn-icon btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Card View (Mobile Optimized)"
                style={{ width: 32, height: 32 }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`btn-icon btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Table View (Desktop Optimized)"
                style={{ width: 32, height: 32 }}
              >
                <List size={15} />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActivePage('pipeline')}
            >
              <TrendingUp size={16} /> Pipeline
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActivePage('add-customer')}
              id="customers-add-btn"
            >
              <UserPlus size={16} /> Add Lead
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div 
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              gap: '0.75rem'
            }}
          >
            <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by company, customer name, phone, email, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                width: '100%'
              }}
              id="customer-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0 }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs Scrollable Row */}
        <div 
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            scrollbarWidth: 'none'
          }}
          className="filter-tabs-row"
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = projectFilter === tab.id;
            const count = getCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProjectFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface)',
                  color: isSelected ? '#60a5fa' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSelected ? '#3b82f6' : 'var(--bg-surface-elevated)',
                    color: isSelected ? '#ffffff' : 'var(--text-tertiary)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Customers List / Cards */}
      {filteredCustomers.length === 0 ? (
        <div 
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <div 
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)'
            }}
          >
            <Briefcase size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No leads found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              {searchQuery 
                ? `No inquiries match your search "${searchQuery}".` 
                : `No leads in this stage right now.`}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActivePage('add-customer')}
          >
            <UserPlus size={16} /> Add First Lead
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
          {filteredCustomers.map((cust) => (
            <CustomerCard 
              key={cust.id} 
              customer={cust} 
              onViewDetails={onViewDetails} 
            />
          ))}
        </div>
      ) : (
        <CustomerTable 
          customers={filteredCustomers} 
          onViewDetails={onViewDetails} 
        />
      )}
    </div>
  );
};

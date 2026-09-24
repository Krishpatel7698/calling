import React from 'react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

export const AnalyticsCharts = ({ stats }) => {
  const { total, newCount, calledCount, interestedCount, notInterestedCount, callLaterCount, convertedCount } = stats;

  const items = [
    { label: 'New', count: newCount, color: '#111111' },
    { label: 'Called', count: calledCount, color: '#EA580C' },
    { label: 'Interested', count: interestedCount, color: '#666666' },
    { label: 'Call Later', count: callLaterCount, color: '#EA580C' },
    { label: 'Not Interested', count: notInterestedCount, color: '#DC2626' },
    { label: 'Converted', count: convertedCount, color: '#16A34A' }
  ];

  // Donut chart SVG calculations
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {/* Chart 1: Calling Status Distribution Donut */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Lead Status Distribution</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current breakdown of customer pipeline</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#111111', fontWeight: 700 }}>
            {total} Total Leads
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', flex: 1, padding: '0.5rem 0' }}>
          {/* Donut graphic */}
          <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#E5E5E5"
                strokeWidth={strokeWidth}
              />
              {total > 0 &&
                items.map((item) => {
                  if (item.count === 0) return null;
                  const percent = item.count / total;
                  const strokeDasharray = `${percent * circumference} ${circumference}`;
                  const strokeDashoffset = -cumulativePercent * circumference;
                  cumulativePercent += percent;

                  return (
                    <circle
                      key={item.label}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  );
                })}
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {total}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customers
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '150px' }}>
            {items.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.count} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart 2: Pipeline Conversion & Health */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Conversion Funnel</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pipeline conversion from initial outreach</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Sparkles size={16} /> {stats.conversionRate}% Rate
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Outreach Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Outreach (Called & Completed)</span>
                <span style={{ fontWeight: 600 }}>{total - newCount} / {total} Leads</span>
              </div>
              <div style={{ height: 8, backgroundColor: '#E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${stats.contactRate}%`, 
                    height: '100%', 
                    backgroundColor: '#111111',
                    borderRadius: 4,
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>High Intent (Interested & Call Later)</span>
                <span style={{ fontWeight: 600 }}>{interestedCount + callLaterCount} Leads</span>
              </div>
              <div style={{ height: 8, backgroundColor: '#E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${total > 0 ? Math.round(((interestedCount + callLaterCount) / total) * 100) : 0}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--warning)',
                    borderRadius: 4,
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>
            </div>

            {/* Conversion to Customers */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Won & Converted</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>{convertedCount} Converted</span>
              </div>
              <div style={{ height: 8, backgroundColor: '#E5E5E5', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${stats.conversionRate}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--success)',
                    borderRadius: 4,
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick stat summary tip */}
        <div 
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <TrendingUp size={20} style={{ color: '#111111', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {callLaterCount > 0 ? (
              <>You have <strong>{callLaterCount} follow-ups scheduled</strong> in "Call Later". Check them out today!</>
            ) : (
              <>Pipeline is healthy. Start dialing newly added leads to boost conversion!</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

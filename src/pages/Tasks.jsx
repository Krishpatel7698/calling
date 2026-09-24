import React, { useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  User, 
  Trash2, 
  X, 
  CheckCircle2, 
  Filter,
  Building2
} from 'lucide-react';

export const Tasks = () => {
  const { 
    tasks, 
    addTask, 
    toggleTaskStatus, 
    deleteTask, 
    customers 
  } = useCustomers();

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Pending', 'Today', 'Completed'
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  // New Task Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [relatedCustomer, setRelatedCustomer] = useState('');
  const [assignedTo, setAssignedTo] = useState('Master Admin');
  const [dueDate, setDueDate] = useState(todayStr);
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState('Medium');

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'Pending' && t.status === 'Completed') return false;
    if (activeTab === 'Completed' && t.status !== 'Completed') return false;
    if (activeTab === 'Today' && (t.dueDate !== todayStr || t.status === 'Completed')) return false;

    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'All' && t.assignedTo !== assigneeFilter) return false;

    return true;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title: title.trim(),
      description: description.trim(),
      relatedCustomer,
      assignedTo,
      dueDate,
      dueTime,
      priority
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setRelatedCustomer('');
    setDueDate(todayStr);
    setIsModalOpen(false);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>High Priority</span>;
      case 'Medium':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>Medium Priority</span>;
      case 'Low':
        return <span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>Low Priority</span>;
      default:
        return null;
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Top Header */}
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Task & Follow-up Action Items</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Schedule client call actions, quotation deadlines, and assign tasks to sales staff
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* Tabs & Filters */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem'
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { id: 'All', label: 'All Tasks', count: tasks.length },
            { id: 'Today', label: 'Due Today', count: tasks.filter((t) => t.dueDate === todayStr && t.status !== 'Completed').length },
            { id: 'Pending', label: 'Pending', count: tasks.filter((t) => t.status !== 'Completed').length },
            { id: 'Completed', label: 'Completed', count: tasks.filter((t) => t.status === 'Completed').length }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.18)' : 'var(--bg-surface)',
                border: activeTab === tab.id ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                color: activeTab === tab.id ? '#60a5fa' : 'var(--text-secondary)'
              }}
            >
              <span>{tab.label}</span>
              <span 
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activeTab === tab.id ? '#3b82f6' : 'var(--bg-surface-elevated)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-tertiary)'
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              padding: '0.45rem 0.65rem',
              fontSize: '0.8rem'
            }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              padding: '0.45rem 0.65rem',
              fontSize: '0.8rem'
            }}
          >
            <option value="All">All Assignees</option>
            <option value="Master Admin">Master Admin</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Patel">Priya Patel</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div 
          className="card" 
          style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}
        >
          <CheckCircle2 size={36} style={{ color: '#34d399', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No tasks match your criteria
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Enjoy the clear desk or click "Create Task" above to schedule a new one!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            const isOverdue = !isCompleted && t.dueDate && t.dueDate < todayStr;

            return (
              <div
                key={t.id}
                className="card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderLeft: isCompleted 
                    ? '4px solid #10b981' 
                    : isOverdue 
                    ? '4px solid #ef4444' 
                    : '4px solid #3b82f6',
                  opacity: isCompleted ? 0.7 : 1
                }}
              >
                {/* Left: Checkbox & Task details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                  <button
                    type="button"
                    onClick={() => toggleTaskStatus(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? '#34d399' : 'var(--text-tertiary)', padding: 0, marginTop: 2 }}
                    aria-label={isCompleted ? 'Mark pending' : 'Mark complete'}
                  >
                    {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h4 
                        style={{ 
                          fontSize: '1rem', 
                          fontWeight: 700, 
                          color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          margin: 0
                        }}
                      >
                        {t.title}
                      </h4>
                      {getPriorityBadge(t.priority)}
                      {isOverdue && (
                        <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                          Overdue
                        </span>
                      )}
                    </div>

                    {t.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.45 }}>
                        {t.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                      {t.relatedCustomer && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#93c5fd' }}>
                          <Building2 size={13} /> {t.relatedCustomer}
                        </span>
                      )}

                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={13} /> Assignee: <strong>{t.assignedTo}</strong>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: isOverdue ? '#f87171' : 'inherit' }}>
                        <Calendar size={13} /> Due: <strong>{t.dueDate}</strong> {t.dueTime && `(${t.dueTime})`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-icon btn-secondary btn-sm"
                    onClick={() => deleteTask(t.id)}
                    title="Delete Task"
                  >
                    <Trash2 size={15} style={{ color: '#f87171' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
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
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Schedule New Task</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Assign follow-up action to sales team
                  </p>
                </div>
              </div>
              <button type="button" className="btn-icon btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="task-title-input">
                    Task Title *
                  </label>
                  <input
                    id="task-title-input"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Call Amit Verma for payment confirmation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="task-desc-input">
                    Description & Instructions
                  </label>
                  <textarea
                    id="task-desc-input"
                    className="form-textarea"
                    rows={2}
                    placeholder="Key talking points or deliverables..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Related Customer / Lead */}
                <div className="form-group">
                  <label className="form-label" htmlFor="task-customer-select">
                    Related Customer / Lead (Optional)
                  </label>
                  <select
                    id="task-customer-select"
                    className="form-input"
                    value={relatedCustomer}
                    onChange={(e) => setRelatedCustomer(e.target.value)}
                  >
                    <option value="">-- No specific lead --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.companyName || c.customerName}>
                        {c.companyName || c.customerName} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee & Priority */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="form-label">Assign To</label>
                    <select
                      className="form-input"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="Master Admin">Master Admin</option>
                      <option value="Rahul Sharma">Rahul Sharma</option>
                      <option value="Priya Patel">Priya Patel</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      className="form-input"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Due Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Due Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
                  <CheckCircle2 size={16} /> Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

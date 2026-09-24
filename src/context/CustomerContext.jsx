import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  subscribeToCustomers, 
  addCustomerToDb, 
  updateCustomerInDb, 
  deleteCustomerFromDb,
  subscribeToTasks,
  addTaskToDb,
  updateTaskInDb,
  deleteTaskFromDb,
  subscribeToQuotations,
  addQuotationToDb,
  updateQuotationInDb,
  deleteQuotationFromDb,
  logAuditInDb
} from '../services/firebase';

const CustomerContext = createContext();

const todayStr = new Date().toISOString().slice(0, 10);
const tomorrowDate = new Date(Date.now() + 86400000);
const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);
const yesterdayDate = new Date(Date.now() - 86400000);
const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

const SAMPLE_CUSTOMERS = [
  {
    id: 'lead-101',
    companyName: 'Apex Innovations Pvt Ltd',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@apexinnovations.in',
    address: '402, Titanium City Centre, Ahmedabad, Gujarat',
    hasProject: true,
    projectType: 'Mobile App',
    dealValue: 125000,
    expectedCloseDate: tomorrowStr,
    assignedTo: 'Rahul Sharma',
    leadSource: 'Website',
    leadStatus: 'Interested',
    notes: 'Inquiry for iOS & Android logistics app development. Sent company deck on WhatsApp.',
    followUpDate: todayStr,
    followUpTime: '15:30',
    documents: [
      { id: 'doc-1', name: 'Mobile_App_Scope.pdf', size: '2.4 MB', type: 'PDF', uploadDate: yesterdayStr }
    ],
    callHistory: [
      { id: 'call-1', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), outcome: 'Interested', note: 'Discussion went very well. Wants demo on Thursday.', duration: '4 min 12 sec', caller: 'Rahul Sharma' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'lead-102',
    companyName: 'Global Cloud Systems',
    customerName: 'Sneha Patel',
    phone: '+91 98234 56789',
    email: 'sneha@globalcloud.com',
    address: 'Block B, Infocity, Gandhinagar, Gujarat',
    hasProject: true,
    projectType: 'CRM',
    dealValue: 85000,
    expectedCloseDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
    assignedTo: 'Master Admin',
    leadSource: 'Google Ads',
    leadStatus: 'Proposal',
    notes: 'Requires calling CRM integration for 15 sales reps. Draft quotation shared.',
    followUpDate: tomorrowStr,
    followUpTime: '11:00',
    documents: [
      { id: 'doc-2', name: 'CRM_Requirements.docx', size: '1.1 MB', type: 'DOCX', uploadDate: yesterdayStr }
    ],
    callHistory: [
      { id: 'call-2', timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), outcome: 'Called', note: 'Discussed user licensing and export capabilities.', duration: '6 min', caller: 'Master Admin' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'lead-103',
    companyName: 'Zenith Retail Outlets',
    customerName: 'Amit Verma',
    phone: '+91 98112 23344',
    email: 'amit@zenithretail.in',
    address: 'Ring Road, Surat, Gujarat',
    hasProject: true,
    projectType: 'Website',
    dealValue: 45000,
    expectedCloseDate: yesterdayStr,
    assignedTo: 'Priya Patel',
    leadSource: 'Referral',
    leadStatus: 'Negotiation',
    notes: 'E-commerce revamp. Agreed on payment in 2 installments. Follow up for token advance.',
    followUpDate: todayStr,
    followUpTime: '17:00',
    documents: [],
    callHistory: [
      { id: 'call-3', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), outcome: 'Call Later', note: 'In a meeting, asked to call in evening.', duration: '1 min', caller: 'Priya Patel' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'lead-104',
    companyName: 'Nexus Healthcare Tech',
    customerName: 'Dr. Priya Desai',
    phone: '+91 98998 87766',
    email: 'dr.priya@nexushealth.org',
    address: 'Near Civil Hospital, Vadodara, Gujarat',
    hasProject: true,
    projectType: 'ERP',
    dealValue: 240000,
    expectedCloseDate: yesterdayStr,
    assignedTo: 'Master Admin',
    leadSource: 'Cold Call',
    leadStatus: 'Won',
    notes: 'Clinic appointment & billing system deal confirmed. Advance received.',
    followUpDate: '',
    followUpTime: '',
    documents: [
      { id: 'doc-3', name: 'Contract_Signed_Nexus.pdf', size: '3.8 MB', type: 'PDF', uploadDate: yesterdayStr }
    ],
    callHistory: [
      { id: 'call-4', timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), outcome: 'Converted', note: 'Deal signed. Sent welcome onboarding email.', duration: '12 min', caller: 'Master Admin' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
  },
  {
    id: 'lead-105',
    companyName: 'Skyline Logistics Hub',
    customerName: 'Vikram Mehta',
    phone: '+91 98776 65544',
    email: 'vikram@skylinelog.com',
    address: 'Transport Nagar, Mumbai, Maharashtra',
    hasProject: false,
    projectType: '',
    dealValue: 0,
    expectedCloseDate: '',
    assignedTo: 'Rahul Sharma',
    leadSource: 'Trade Show',
    leadStatus: 'Lost',
    notes: 'Decided to put IT software expansion on hold until next financial quarter.',
    followUpDate: '',
    followUpTime: '',
    documents: [],
    callHistory: [
      { id: 'call-5', timestamp: new Date(Date.now() - 3600000 * 50).toISOString(), outcome: 'Not Interested', note: 'Budget deferred to next year.', duration: '3 min', caller: 'Rahul Sharma' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString()
  }
];

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Send Mobile App revised quotation',
    description: 'Update the pricing with 18% GST and iOS test flight schedule.',
    relatedCustomer: 'Apex Innovations Pvt Ltd',
    customerId: 'lead-101',
    assignedTo: 'Rahul Sharma',
    dueDate: todayStr,
    dueTime: '16:00',
    priority: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'task-2',
    title: 'Schedule CRM Architecture walkthrough demo',
    description: 'Prepare video presentation of the multi-agent calling screen.',
    relatedCustomer: 'Global Cloud Systems',
    customerId: 'lead-102',
    assignedTo: 'Master Admin',
    dueDate: tomorrowStr,
    dueTime: '11:30',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'task-3',
    title: 'Call Amit Verma for token advance confirmation',
    description: 'Verify bank NEFT reference number and initiate design kickoff.',
    relatedCustomer: 'Zenith Retail Outlets',
    customerId: 'lead-103',
    assignedTo: 'Priya Patel',
    dueDate: todayStr,
    dueTime: '17:30',
    priority: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  }
];

const SAMPLE_QUOTATIONS = [
  {
    id: 'QT-2026-101',
    type: 'Quotation',
    customerId: 'lead-101',
    companyName: 'Apex Innovations Pvt Ltd',
    customerName: 'Rahul Sharma',
    email: 'rahul@apexinnovations.in',
    phone: '+91 98765 43210',
    address: '402, Titanium City Centre, Ahmedabad',
    date: yesterdayStr,
    validUntil: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    items: [
      { id: 'item-1', description: 'Cross-platform Mobile App Development (React Native)', qty: 1, rate: 95000, amount: 95000 },
      { id: 'item-2', description: 'Real-time GPS Tracking Backend API setup', qty: 1, rate: 30000, amount: 30000 }
    ],
    subtotal: 125000,
    discountPercent: 5,
    discountAmount: 6250,
    taxRate: 18,
    taxAmount: 21375,
    grandTotal: 140125,
    paymentStatus: 'Pending',
    notes: 'Quotation valid for 15 days. 50% advance on project kickoff, 30% on beta milestone, 20% on deployment.',
    paymentHistory: [],
    createdAt: yesterdayStr
  },
  {
    id: 'INV-2026-004',
    type: 'Invoice',
    customerId: 'lead-104',
    companyName: 'Nexus Healthcare Tech',
    customerName: 'Dr. Priya Desai',
    email: 'dr.priya@nexushealth.org',
    phone: '+91 98998 87766',
    address: 'Near Civil Hospital, Vadodara, Gujarat',
    date: yesterdayStr,
    validUntil: tomorrowStr,
    items: [
      { id: 'item-10', description: 'Clinic ERP System - Enterprise Cloud License (1 Year)', qty: 1, rate: 200000, amount: 200000 },
      { id: 'item-11', description: 'Data Migration & Staff Onboarding Training', qty: 1, rate: 40000, amount: 40000 }
    ],
    subtotal: 240000,
    discountPercent: 0,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 43200,
    grandTotal: 283200,
    paymentStatus: 'Paid',
    notes: 'Payment received via HDFC Bank NEFT. Project implementation active.',
    paymentHistory: [
      { id: 'pay-1', date: yesterdayStr, amount: 283200, mode: 'NEFT / Bank Transfer', reference: 'HDFC9823482109' }
    ],
    createdAt: yesterdayStr
  }
];

const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'CallPulse CRM Solutions Pvt. Ltd.',
  tagline: 'Enterprise Calling & Sales Automation',
  phone: '+91 98765 00000',
  email: 'contact@callpulse.crm',
  website: 'https://callpulse.crm',
  address: '10th Floor, Tech Hub Tower, SG Highway, Ahmedabad, Gujarat 380054',
  gstin: '24AAACC1234M1Z2',
  pan: 'AAACC1234M',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200012345678',
  ifscCode: 'HDFC0001234',
  currency: '₹',
  taxRate: 18,
  invoiceTerms: '1. All payments due within 7 days of invoice date.\n2. Invoices are subject to 18% GST under Indian tax regulations.\n3. Make payments payable to CallPulse CRM Solutions Pvt. Ltd.'
};

const DEFAULT_PRODUCTS = [
  { id: 'prod-1', name: 'Mobile App Development (iOS & Android)', category: 'Development', price: 95000 },
  { id: 'prod-2', name: 'Corporate Responsive Website', category: 'Web', price: 35000 },
  { id: 'prod-3', name: 'Custom Sales CRM & Pipeline Suite', category: 'Software', price: 65000 },
  { id: 'prod-4', name: 'Enterprise ERP Solution Setup', category: 'Enterprise', price: 180000 },
  { id: 'prod-5', name: 'Annual Software Maintenance (AMC)', category: 'Support', price: 25000 }
];

const DEFAULT_SOURCES = ['Website', 'Google Ads', 'Referral', 'Cold Call', 'LinkedIn', 'WhatsApp', 'Trade Show', 'Direct Walk-in'];
const DEFAULT_STATUSES = ['New Lead', 'Contacted', 'Interested', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export const CustomerProvider = ({ children }) => {
  // 1. Leads State
  const [customers, setCustomers] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_crm_customers');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_CUSTOMERS;
  });

  // 2. Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_crm_tasks');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_TASKS;
  });

  // 3. Quotations State
  const [quotations, setQuotations] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_crm_quotations');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_QUOTATIONS;
  });

  // 4. Company Settings State
  const [companySettings, setCompanySettings] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_company_settings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_COMPANY_SETTINGS;
  });

  // 5. Products Catalog
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_products');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  // 6. Lead Sources & Statuses
  const [leadSources, setLeadSources] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_lead_sources');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_SOURCES;
  });

  const [leadStatuses, setLeadStatuses] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_lead_statuses');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_STATUSES;
  });

  // 7. Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const raw = localStorage.getItem('calling_audit_logs');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), user: 'Rahul Sharma', role: 'Sales Executive', action: 'Call Logged', details: 'Spoke with Apex Innovations (Rahul Sharma) - outcome: Interested' },
      { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), user: 'Master Admin', role: 'Admin', action: 'Quotation Generated', details: 'Created Quotation #QT-2026-101 for Apex Innovations (₹1,40,125)' },
      { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), user: 'Master Admin', role: 'Admin', action: 'Deal Won', details: 'Moved Nexus Healthcare Tech to WON stage! Revenue: ₹2,83,200' }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');

  // Modals state
  const [editModalData, setEditModalData] = useState({ isOpen: false, customer: null });
  const [callModalData, setCallModalData] = useState({ isOpen: false, customer: null });
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.id === toast?.id ? null : curr));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Persistence Helpers
  const saveCustomers = (list) => {
    setCustomers(list);
    try { localStorage.setItem('calling_crm_customers', JSON.stringify(list)); } catch {}
  };

  const saveTasks = (list) => {
    setTasks(list);
    try { localStorage.setItem('calling_crm_tasks', JSON.stringify(list)); } catch {}
  };

  const saveQuotations = (list) => {
    setQuotations(list);
    try { localStorage.setItem('calling_crm_quotations', JSON.stringify(list)); } catch {}
  };

  const updateCompanySettings = (updates) => {
    const updated = { ...companySettings, ...updates };
    setCompanySettings(updated);
    try { localStorage.setItem('calling_company_settings', JSON.stringify(updated)); } catch {}
    showToast('Company settings updated', 'success');
  };

  const saveAuditLog = (entry) => {
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    const updated = [newLog, ...auditLogs].slice(0, 50);
    setAuditLogs(updated);
    try { localStorage.setItem('calling_audit_logs', JSON.stringify(updated)); } catch {}
    logAuditInDb(newLog);
  };

  // Real-time Firestore sync
  useEffect(() => {
    const unsubCustomers = subscribeToCustomers(
      (data) => {
        if (data && data.length > 0) saveCustomers(data);
      },
      () => {}
    );

    const unsubTasks = subscribeToTasks(
      (data) => {
        if (data && data.length > 0) saveTasks(data);
      },
      () => {}
    );

    const unsubQuotes = subscribeToQuotations(
      (data) => {
        if (data && data.length > 0) saveQuotations(data);
      },
      () => {}
    );

    return () => {
      if (typeof unsubCustomers === 'function') unsubCustomers();
      if (typeof unsubTasks === 'function') unsubTasks();
      if (typeof unsubQuotes === 'function') unsubQuotes();
    };
  }, []);

  // Filtered Leads
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (projectFilter === 'Yes') {
      result = result.filter((c) => c.hasProject === true);
    } else if (projectFilter === 'No') {
      result = result.filter((c) => c.hasProject === false);
    } else if (['Mobile App', 'Website', 'CRM', 'ERP'].includes(projectFilter)) {
      result = result.filter((c) => c.hasProject === true && c.projectType === projectFilter);
    } else if (['New Lead', 'Contacted', 'Interested', 'Proposal', 'Negotiation', 'Won', 'Lost'].includes(projectFilter)) {
      result = result.filter((c) => (c.leadStatus || c.status) === projectFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const companyMatch = (c.companyName || '').toLowerCase().includes(q);
        const nameMatch = (c.customerName || c.name || '').toLowerCase().includes(q);
        const phoneMatch = (c.phone || '').toLowerCase().includes(q);
        const emailMatch = (c.email || '').toLowerCase().includes(q);
        const typeMatch = (c.projectType || '').toLowerCase().includes(q);
        const notesMatch = (c.notes || '').toLowerCase().includes(q);
        const statusMatch = (c.leadStatus || c.status || '').toLowerCase().includes(q);
        return companyMatch || nameMatch || phoneMatch || emailMatch || typeMatch || notesMatch || statusMatch;
      });
    }

    return result;
  }, [customers, searchQuery, projectFilter]);

  // Comprehensive CRM Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const newLeads = customers.filter((c) => (c.leadStatus || c.status) === 'New Lead' || (c.leadStatus || c.status) === 'New').length;
    const contactedLeads = customers.filter((c) => (c.leadStatus || c.status) === 'Contacted' || (c.leadStatus || c.status) === 'Called').length;
    const interestedLeads = customers.filter((c) => (c.leadStatus || c.status) === 'Interested').length;
    const proposalLeads = customers.filter((c) => (c.leadStatus || c.status) === 'Proposal').length;
    const negotiationLeads = customers.filter((c) => (c.leadStatus || c.status) === 'Negotiation').length;
    const converted = customers.filter((c) => (c.leadStatus || c.status) === 'Won' || (c.leadStatus || c.status) === 'Converted').length;
    const lost = customers.filter((c) => (c.leadStatus || c.status) === 'Lost' || (c.leadStatus || c.status) === 'Not Interested').length;
    
    const withProject = customers.filter((c) => c.hasProject === true).length;
    const withoutProject = customers.filter((c) => c.hasProject === false).length;
    const mobileApps = customers.filter((c) => c.hasProject && c.projectType === 'Mobile App').length;
    const websites = customers.filter((c) => c.hasProject && c.projectType === 'Website').length;
    const crms = customers.filter((c) => c.hasProject && c.projectType === 'CRM').length;
    const erps = customers.filter((c) => c.hasProject && c.projectType === 'ERP').length;

    // Follow-ups due today or overdue
    const pendingFollowUps = customers.filter((c) => {
      if (!c.followUpDate) return false;
      const isClosed = ['Won', 'Lost', 'Converted', 'Not Interested'].includes(c.leadStatus || c.status);
      return !isClosed && c.followUpDate <= todayStr;
    });

    // Sales Revenue Amount
    const totalPipelineAmount = customers.reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);
    const wonRevenue = customers
      .filter((c) => (c.leadStatus || c.status) === 'Won' || (c.leadStatus || c.status) === 'Converted')
      .reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);

    const paidInvoicesRevenue = quotations
      .filter((q) => q.type === 'Invoice' && q.paymentStatus === 'Paid')
      .reduce((sum, q) => sum + (Number(q.grandTotal) || 0), 0);

    const totalSalesAmount = wonRevenue > 0 ? wonRevenue : paidInvoicesRevenue;

    // Employee Performance calculation
    const employeeNames = ['Master Admin', 'Rahul Sharma', 'Priya Patel'];
    const employeeStats = employeeNames.map((emp) => {
      const empLeads = customers.filter((c) => (c.assignedTo || 'Master Admin') === emp);
      const wonDeals = empLeads.filter((c) => (c.leadStatus || c.status) === 'Won' || (c.leadStatus || c.status) === 'Converted');
      const totalEmpRevenue = wonDeals.reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);
      
      let callsCount = 0;
      customers.forEach((c) => {
        if (Array.isArray(c.callHistory)) {
          callsCount += c.callHistory.filter((ch) => ch.caller === emp).length;
        }
      });

      return {
        name: emp,
        assignedCount: empLeads.length,
        wonCount: wonDeals.length,
        revenue: totalEmpRevenue,
        callsMade: callsCount,
        conversionRate: empLeads.length > 0 ? Math.round((wonDeals.length / empLeads.length) * 100) : 0
      };
    });

    return {
      total,
      newLeads,
      contactedLeads,
      interestedLeads,
      proposalLeads,
      negotiationLeads,
      converted,
      lost,
      withProject,
      withoutProject,
      mobileApps,
      websites,
      crms,
      erps,
      pendingFollowUps: pendingFollowUps.length,
      pendingFollowUpList: pendingFollowUps,
      totalPipelineAmount,
      totalSalesAmount,
      employeeStats,
      projectRate: total > 0 ? Math.round((withProject / total) * 100) : 0
    };
  }, [customers, quotations]);

  // Notifications calculation
  const notifications = useMemo(() => {
    const list = [];

    // 1. Pending follow-ups
    stats.pendingFollowUpList.forEach((c) => {
      list.push({
        id: 'notif-fu-' + c.id,
        type: 'follow-up',
        title: `Follow-up Due: ${c.companyName || c.customerName}`,
        message: `Scheduled for ${c.followUpDate === todayStr ? 'Today' : c.followUpDate} at ${c.followUpTime || 'anytime'}`,
        time: c.followUpTime || '12:00',
        customerId: c.id,
        phone: c.phone
      });
    });

    // 2. Tasks due today
    tasks.filter((t) => t.dueDate === todayStr && t.status !== 'Completed').forEach((t) => {
      list.push({
        id: 'notif-task-' + t.id,
        type: 'task',
        title: `Task Due Today: ${t.title}`,
        message: `Assigned to ${t.assignedTo} • Priority: ${t.priority}`,
        time: t.dueTime || '18:00',
        taskId: t.id
      });
    });

    // 3. Pending Payments
    quotations.filter((q) => q.type === 'Invoice' && (q.paymentStatus === 'Pending' || q.paymentStatus === 'Overdue')).forEach((q) => {
      list.push({
        id: 'notif-inv-' + q.id,
        type: 'payment',
        title: `Payment Pending: ${q.companyName}`,
        message: `Invoice #${q.id} • ${companySettings.currency}${q.grandTotal.toLocaleString()}`,
        time: q.validUntil,
        quoteId: q.id
      });
    });

    return list;
  }, [stats.pendingFollowUpList, tasks, quotations, companySettings.currency]);

  // ==========================================
  // CUSTOMER / LEAD CRUD
  // ==========================================

  const addCustomer = async (data) => {
    const newRecord = {
      id: 'lead-' + Date.now(),
      companyName: (data.companyName || '').trim(),
      customerName: (data.customerName || data.name || '').trim(),
      phone: (data.phone || '').trim(),
      email: (data.email || '').trim(),
      address: (data.address || '').trim(),
      hasProject: Boolean(data.hasProject),
      projectType: data.hasProject ? (data.projectType || 'Mobile App') : '',
      dealValue: Number(data.dealValue) || 0,
      expectedCloseDate: data.expectedCloseDate || '',
      assignedTo: data.assignedTo || 'Master Admin',
      leadSource: data.leadSource || 'Website',
      leadStatus: data.leadStatus || 'New Lead',
      status: data.leadStatus || 'New Lead',
      notes: (data.notes || '').trim(),
      followUpDate: data.followUpDate || '',
      followUpTime: data.followUpTime || '',
      documents: [],
      callHistory: [],
      createdAt: new Date().toISOString()
    };

    try {
      const created = await addCustomerToDb(newRecord);
      const saved = { ...newRecord, id: created.id };
      saveCustomers([saved, ...customers]);
      saveAuditLog({
        user: 'Active User',
        action: 'New Lead Created',
        details: `Created lead for ${newRecord.companyName} (${newRecord.customerName})`
      });
      showToast(`Lead "${newRecord.companyName || newRecord.customerName}" created!`, 'success');
      return { success: true, customer: saved };
    } catch {
      saveCustomers([newRecord, ...customers]);
      saveAuditLog({
        user: 'Active User',
        action: 'New Lead Created (Offline)',
        details: `Created lead for ${newRecord.companyName} (${newRecord.customerName})`
      });
      showToast(`Lead "${newRecord.companyName || newRecord.customerName}" created!`, 'success');
      return { success: true, customer: newRecord };
    }
  };

  const updateCustomer = async (id, updateFields) => {
    const updatedList = customers.map((c) => (c.id === id ? { ...c, ...updateFields } : c));
    saveCustomers(updatedList);
    try {
      await updateCustomerInDb(id, updateFields);
    } catch {}
    saveAuditLog({
      user: 'Active User',
      action: 'Lead Updated',
      details: `Updated details for lead ID ${id}`
    });
    showToast('Lead details updated successfully', 'success');
    return { success: true };
  };

  const deleteCustomer = async (id, name = 'Lead') => {
    const updatedList = customers.filter((c) => c.id !== id);
    saveCustomers(updatedList);
    try {
      await deleteCustomerFromDb(id);
    } catch {}
    saveAuditLog({
      user: 'Active User',
      action: 'Lead Deleted',
      details: `Removed lead "${name}"`
    });
    showToast(`"${name}" removed successfully`, 'info');
    return { success: true };
  };

  // Advance Pipeline stage
  const moveLeadStage = async (id, newStage) => {
    const target = customers.find((c) => c.id === id);
    if (!target) return;

    await updateCustomer(id, { leadStatus: newStage, status: newStage });

    if (newStage === 'Won') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
      showToast(`🎉 Congratulations! Deal with "${target.companyName || target.customerName}" marked as WON!`, 'success');
      saveAuditLog({
        user: 'Active User',
        action: 'Deal Won! 🏆',
        details: `Moved ${target.companyName} to WON stage! Value: ${companySettings.currency}${(Number(target.dealValue) || 0).toLocaleString()}`
      });
    } else {
      showToast(`Moved to ${newStage}`, 'info');
    }
  };

  // Add document to lead
  const addCustomerDocument = async (customerId, docData) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: docData.name || 'Untitled Document.pdf',
      size: docData.size || '1.2 MB',
      type: docData.type || 'PDF',
      uploadDate: todayStr
    };
    const updatedDocs = [...(target.documents || []), newDoc];
    await updateCustomer(customerId, { documents: updatedDocs });
    showToast('Document attached successfully', 'success');
  };

  const deleteCustomerDocument = async (customerId, docId) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;
    const updatedDocs = (target.documents || []).filter((d) => d.id !== docId);
    await updateCustomer(customerId, { documents: updatedDocs });
    showToast('Document removed', 'info');
  };

  // ==========================================
  // CALLING & FOLLOW-UP
  // ==========================================

  const initiateCall = (customer) => {
    if (!customer || !customer.phone) {
      showToast('No valid phone number for this customer', 'error');
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
    // Open disposition modal for easy logging
    openCallModal(customer);
  };

  const openCallModal = (customer) => {
    setCallModalData({ isOpen: true, customer });
  };

  const closeCallModal = () => {
    setCallModalData({ isOpen: false, customer: null });
  };

  const completeCall = async (customerId, outcome, note, nextDate, nextTime, duration = '2 min') => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;

    const callRecord = {
      id: 'call-' + Date.now(),
      timestamp: new Date().toISOString(),
      outcome,
      note: note || '',
      duration,
      caller: 'Active User'
    };

    const updatedHistory = [callRecord, ...(target.callHistory || [])];
    const updatePayload = {
      leadStatus: outcome === 'Converted' ? 'Won' : outcome === 'Not Interested' ? 'Lost' : outcome,
      status: outcome,
      lastCalledAt: new Date().toISOString(),
      callHistory: updatedHistory,
      notes: note ? `${note}\n\n${target.notes || ''}` : target.notes
    };

    if (nextDate) {
      updatePayload.followUpDate = nextDate;
      updatePayload.followUpTime = nextTime || '11:00';
    }

    await updateCustomer(customerId, updatePayload);
    closeCallModal();
    saveAuditLog({
      user: 'Active User',
      action: 'Call Outcome Logged',
      details: `Called ${target.companyName || target.customerName}: ${outcome}. Note: ${note || 'No notes'}`
    });
    showToast(`Call outcome saved as "${outcome}"`, 'success');
  };

  // ==========================================
  // TASK MANAGEMENT CRUD
  // ==========================================

  const addTask = async (taskData) => {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      relatedCustomer: taskData.relatedCustomer || '',
      customerId: taskData.customerId || '',
      assignedTo: taskData.assignedTo || 'Master Admin',
      dueDate: taskData.dueDate || todayStr,
      dueTime: taskData.dueTime || '17:00',
      priority: taskData.priority || 'Medium',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const created = await addTaskToDb(newTask);
      saveTasks([{ ...newTask, id: created.id }, ...tasks]);
    } catch {
      saveTasks([newTask, ...tasks]);
    }

    saveAuditLog({
      user: 'Active User',
      action: 'Task Created',
      details: `Created task "${newTask.title}" for ${newTask.assignedTo}`
    });
    showToast(`Task "${newTask.title}" scheduled!`, 'success');
  };

  const updateTask = async (id, updates) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTasks(updated);
    try { await updateTaskInDb(id, updates); } catch {}
  };

  const toggleTaskStatus = async (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const newStatus = target.status === 'Completed' ? 'Pending' : 'Completed';
    await updateTask(id, { status: newStatus });
    showToast(`Task marked as ${newStatus}`, 'info');
  };

  const deleteTask = async (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    try { await deleteTaskFromDb(id); } catch {}
    showToast('Task removed', 'info');
  };

  // ==========================================
  // QUOTATION & INVOICE MANAGEMENT CRUD
  // ==========================================

  const addQuotation = async (quoteData) => {
    const newQuote = {
      id: (quoteData.type === 'Invoice' ? 'INV-' : 'QT-') + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      type: quoteData.type || 'Quotation',
      customerId: quoteData.customerId || '',
      companyName: quoteData.companyName || '',
      customerName: quoteData.customerName || '',
      email: quoteData.email || '',
      phone: quoteData.phone || '',
      address: quoteData.address || '',
      date: quoteData.date || todayStr,
      validUntil: quoteData.validUntil || tomorrowStr,
      items: quoteData.items || [],
      subtotal: Number(quoteData.subtotal) || 0,
      discountPercent: Number(quoteData.discountPercent) || 0,
      discountAmount: Number(quoteData.discountAmount) || 0,
      taxRate: Number(quoteData.taxRate) || 18,
      taxAmount: Number(quoteData.taxAmount) || 0,
      grandTotal: Number(quoteData.grandTotal) || 0,
      paymentStatus: quoteData.paymentStatus || 'Pending',
      notes: quoteData.notes || companySettings.invoiceTerms,
      paymentHistory: [],
      createdAt: new Date().toISOString()
    };

    try {
      const created = await addQuotationToDb(newQuote);
      saveQuotations([{ ...newQuote, id: created.id }, ...quotations]);
    } catch {
      saveQuotations([newQuote, ...quotations]);
    }

    saveAuditLog({
      user: 'Active User',
      action: `${newQuote.type} Created`,
      details: `Generated ${newQuote.type} #${newQuote.id} for ${newQuote.companyName} (${companySettings.currency}${newQuote.grandTotal.toLocaleString()})`
    });
    showToast(`${newQuote.type} #${newQuote.id} generated!`, 'success');
    return newQuote;
  };

  const updateQuotation = async (id, updates) => {
    const updated = quotations.map((q) => (q.id === id ? { ...q, ...updates } : q));
    saveQuotations(updated);
    try { await updateQuotationInDb(id, updates); } catch {}
    showToast('Updated successfully', 'success');
  };

  const deleteQuotation = async (id) => {
    const updated = quotations.filter((q) => q.id !== id);
    saveQuotations(updated);
    try { await deleteQuotationFromDb(id); } catch {}
    showToast('Record removed', 'info');
  };

  const recordPayment = async (quoteId, paymentData) => {
    const target = quotations.find((q) => q.id === quoteId);
    if (!target) return;

    const newPayment = {
      id: 'pay-' + Date.now(),
      date: paymentData.date || todayStr,
      amount: Number(paymentData.amount) || 0,
      mode: paymentData.mode || 'UPI',
      reference: paymentData.reference || ''
    };

    const updatedHistory = [...(target.paymentHistory || []), newPayment];
    const totalPaid = updatedHistory.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const newStatus = totalPaid >= target.grandTotal ? 'Paid' : 'Partial';

    await updateQuotation(quoteId, {
      paymentHistory: updatedHistory,
      paymentStatus: newStatus
    });

    saveAuditLog({
      user: 'Active User',
      action: 'Payment Recorded',
      details: `Recorded payment of ${companySettings.currency}${newPayment.amount.toLocaleString()} for Invoice #${quoteId} via ${newPayment.mode}`
    });

    if (newStatus === 'Paid') {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast(`Payment received in full! Invoice #${quoteId} marked as PAID.`, 'success');
    } else {
      showToast(`Partial payment of ${companySettings.currency}${newPayment.amount} recorded`, 'success');
    }
  };

  const convertQuotationToInvoice = async (quoteId) => {
    const target = quotations.find((q) => q.id === quoteId);
    if (!target) return;

    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const updated = {
      ...target,
      id: invoiceNumber,
      type: 'Invoice',
      date: todayStr,
      validUntil: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      paymentStatus: 'Pending'
    };

    saveQuotations([updated, ...quotations.filter((q) => q.id !== quoteId)]);
    saveAuditLog({
      user: 'Active User',
      action: 'Converted to Invoice',
      details: `Converted Quotation #${quoteId} to Invoice #${invoiceNumber}`
    });
    showToast(`Converted to Invoice #${invoiceNumber}!`, 'success');
  };

  // Edit Customer Modal Helpers
  const openEditModal = (customer) => {
    setEditModalData({ isOpen: true, customer });
  };

  const closeEditModal = () => {
    setEditModalData({ isOpen: false, customer: null });
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        loading,
        stats,
        searchQuery,
        setSearchQuery,
        projectFilter,
        setProjectFilter,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        moveLeadStage,
        addCustomerDocument,
        deleteCustomerDocument,
        initiateCall,
        openCallModal,
        closeCallModal,
        completeCall,
        editModalData,
        openEditModal,
        closeEditModal,
        callModalData,
        tasks,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        quotations,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        recordPayment,
        convertQuotationToInvoice,
        companySettings,
        updateCompanySettings,
        products,
        setProducts,
        leadSources,
        setLeadSources,
        leadStatuses,
        setLeadStatuses,
        auditLogs,
        notifications,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        toast,
        showToast,
        closeToast
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);

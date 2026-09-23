import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  subscribeToCustomers, 
  addCustomerToDb, 
  updateCustomerInDb, 
  deleteCustomerFromDb 
} from '../services/firebase';

const CustomerContext = createContext();

const SAMPLE_CUSTOMERS = [
  {
    id: 'lead-101',
    companyName: 'Apex Innovations',
    customerName: 'Rahul Sharma',
    phone: '+919876543210',
    hasProject: true,
    projectType: 'Mobile App',
    notes: 'Inquiry for iOS & Android app development with real-time tracking.',
    status: 'Interested',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'lead-102',
    companyName: 'Global Cloud Systems',
    customerName: 'Sneha Patel',
    phone: '+919823456789',
    hasProject: true,
    projectType: 'CRM',
    notes: 'Needs dedicated sales calling CRM integration for 15 sales reps.',
    status: 'Call Later',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'lead-103',
    companyName: 'Zenith Retail',
    customerName: 'Amit Verma',
    phone: '+919811223344',
    hasProject: true,
    projectType: 'Website',
    notes: 'E-commerce revamp inquiry. Followed up on WhatsApp.',
    status: 'Called',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'lead-104',
    companyName: 'Skyline Logistics',
    customerName: 'Vikram Mehta',
    phone: '+919877665544',
    hasProject: false,
    projectType: '',
    notes: 'General consultation inquiry for fleet digitalization.',
    status: 'Not Interested',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: 'lead-105',
    companyName: 'Nexus Healthcare',
    customerName: 'Dr. Priya Desai',
    phone: '+919899887766',
    hasProject: true,
    projectType: 'ERP',
    notes: 'Clinic appointment & billing system inquiry. Deal confirmed.',
    status: 'Converted',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

const loadLocalCustomers = () => {
  try {
    const raw = localStorage.getItem('calling_crm_customers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SAMPLE_CUSTOMERS;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => loadLocalCustomers());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All'); // 'All', 'Yes', 'No', 'Mobile App', 'Website', 'CRM', 'ERP'

  // Active Edit Customer Modal State
  const [editModalData, setEditModalData] = useState({
    isOpen: false,
    customer: null
  });

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.id === toast?.id ? null : curr));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Save to local cache helper
  const saveLocal = (items) => {
    try {
      localStorage.setItem('calling_crm_customers', JSON.stringify(items));
    } catch {}
  };

  // Real-time Cloud Firestore subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCustomers(
      (data) => {
        if (data && data.length > 0) {
          setCustomers(data);
          saveLocal(data);
        } else {
          // If Firestore is empty, preserve local/sample data
          setCustomers((prev) => {
            const current = prev.length > 0 ? prev : loadLocalCustomers();
            saveLocal(current);
            return current;
          });
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn('Firestore subscription unavailable, using local CRM storage:', err.message);
        // Seamless fallback: keep local/demo data active
        setCustomers((prev) => (prev.length > 0 ? prev : loadLocalCustomers()));
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filtered inquiries
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Filter by project criteria
    if (projectFilter === 'Yes') {
      result = result.filter((c) => c.hasProject === true);
    } else if (projectFilter === 'No') {
      result = result.filter((c) => c.hasProject === false);
    } else if (['Mobile App', 'Website', 'CRM', 'ERP'].includes(projectFilter)) {
      result = result.filter((c) => c.hasProject === true && c.projectType === projectFilter);
    }

    // Search query: Company Name, Customer Name, Phone, Project Type, Notes
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const companyMatch = (c.companyName || '').toLowerCase().includes(q);
        const nameMatch = (c.customerName || c.name || '').toLowerCase().includes(q);
        const phoneMatch = (c.phone || '').toLowerCase().includes(q);
        const typeMatch = (c.projectType || '').toLowerCase().includes(q);
        const notesMatch = (c.notes || '').toLowerCase().includes(q);
        return companyMatch || nameMatch || phoneMatch || typeMatch || notesMatch;
      });
    }

    return result;
  }, [customers, searchQuery, projectFilter]);

  // Statistics calculation for Dashboard & Tabs
  const stats = useMemo(() => {
    const total = customers.length;
    const withProject = customers.filter((c) => c.hasProject === true).length;
    const withoutProject = customers.filter((c) => c.hasProject === false).length;
    const mobileApps = customers.filter((c) => c.hasProject && c.projectType === 'Mobile App').length;
    const websites = customers.filter((c) => c.hasProject && c.projectType === 'Website').length;
    const crms = customers.filter((c) => c.hasProject && c.projectType === 'CRM').length;
    const erps = customers.filter((c) => c.hasProject && c.projectType === 'ERP').length;

    return {
      total,
      withProject,
      withoutProject,
      mobileApps,
      websites,
      crms,
      erps,
      projectRate: total > 0 ? Math.round((withProject / total) * 100) : 0
    };
  }, [customers]);

  // Add inquiry
  const addCustomer = async (inquiryData) => {
    const newRecord = {
      id: 'local-' + Date.now(),
      companyName: (inquiryData.companyName || '').trim(),
      customerName: (inquiryData.customerName || inquiryData.name || '').trim(),
      phone: (inquiryData.phone || '').trim(),
      hasProject: Boolean(inquiryData.hasProject),
      projectType: inquiryData.hasProject ? (inquiryData.projectType || 'Mobile App') : '',
      notes: (inquiryData.notes || '').trim(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    try {
      const created = await addCustomerToDb(inquiryData);
      showToast(`Inquiry for "${inquiryData.companyName || inquiryData.customerName}" saved!`, 'success');
      return { success: true, customer: created };
    } catch (err) {
      // Local fallback
      setCustomers((prev) => {
        const updated = [newRecord, ...prev];
        saveLocal(updated);
        return updated;
      });
      showToast(`Inquiry for "${inquiryData.companyName || inquiryData.customerName}" saved locally!`, 'success');
      return { success: true, customer: newRecord };
    }
  };

  // Update inquiry
  const updateCustomer = async (id, updateFields) => {
    try {
      await updateCustomerInDb(id, updateFields);
      showToast('Inquiry updated successfully', 'success');
      return { success: true };
    } catch (err) {
      // Local fallback
      setCustomers((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...updateFields } : c));
        saveLocal(updated);
        return updated;
      });
      showToast('Inquiry updated successfully', 'success');
      return { success: true };
    }
  };

  // Delete inquiry
  const deleteCustomer = async (id, name = 'Inquiry') => {
    try {
      await deleteCustomerFromDb(id);
      showToast(`"${name}" removed successfully`, 'info');
      return { success: true };
    } catch (err) {
      // Local fallback
      setCustomers((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveLocal(updated);
        return updated;
      });
      showToast(`"${name}" removed successfully`, 'info');
      return { success: true };
    }
  };

  // Call Customer: triggers mobile dialer immediately
  const initiateCall = (customer) => {
    if (!customer || !customer.phone) {
      showToast('No valid phone number for this customer', 'error');
      return;
    }
    const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  // Open Edit Modal
  const openEditModal = (customer) => {
    setEditModalData({
      isOpen: true,
      customer
    });
  };

  const closeEditModal = () => {
    setEditModalData({
      isOpen: false,
      customer: null
    });
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        loading,
        error,
        stats,
        searchQuery,
        setSearchQuery,
        projectFilter,
        setProjectFilter,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        initiateCall,
        editModalData,
        openEditModal,
        callModalData: { isOpen: false, customer: null },
        closeCallModal: () => {},
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

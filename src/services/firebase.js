import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

// Pure environment variable Firebase configuration (.env)
export const getActiveFirebaseConfig = () => {
  const envConfig = {
    apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || '').trim(),
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim(),
    storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
    messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    appId: (import.meta.env.VITE_FIREBASE_APP_ID || '').trim()
  };

  if (
    envConfig.apiKey && 
    envConfig.projectId && 
    envConfig.apiKey !== 'your_api_key_here'
  ) {
    return envConfig;
  }

  return null;
};

let app = null;
let auth = null;
let db = null;
let isConfigured = false;

// Initialize Firebase if valid config exists in .env
const activeConfig = getActiveFirebaseConfig();
if (activeConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(activeConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
    console.log('Firebase initialized successfully from .env with project:', activeConfig.projectId);
  } catch (err) {
    console.error('Failed to initialize Firebase from .env:', err);
    isConfigured = false;
  }
}

export const isFirebaseActive = () => isConfigured && !!db && !!auth;

/* =========================================================================
   AUTHENTICATION API (FIREBASE ONLY)
   ========================================================================= */

export const loginAdmin = async (email, password) => {
  if (!isFirebaseActive()) {
    return { 
      user: null, 
      error: 'Firebase is not configured. Please add your Firebase credentials in Settings or .env.local.' 
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (err) {
    let friendlyMessage = err.message;
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      friendlyMessage = 'Invalid email or password. Please verify your credentials in Firebase Authentication.';
    } else if (err.code === 'auth/too-many-requests') {
      friendlyMessage = 'Access temporarily disabled due to many failed login attempts. Please try again later.';
    }
    return { user: null, error: friendlyMessage };
  }
};

export const registerAdmin = async (email, password) => {
  if (!isFirebaseActive()) {
    return { 
      user: null, 
      error: 'Firebase is not configured. Please verify your credentials in .env.' 
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (err) {
    let friendlyMessage = err.message;
    if (err.code === 'auth/email-already-in-use') {
      friendlyMessage = 'This email is already registered. Please sign in instead.';
    } else if (err.code === 'auth/weak-password') {
      friendlyMessage = 'Password should be at least 6 characters.';
    } else if (err.code === 'auth/invalid-email') {
      friendlyMessage = 'Please enter a valid email address.';
    } else if (err.code === 'auth/operation-not-allowed') {
      friendlyMessage = 'Email/Password sign-in is not enabled in your Firebase Console. Please enable it under Authentication > Sign-in method.';
    }
    return { user: null, error: friendlyMessage };
  }
};

export const logoutAdmin = async () => {
  if (isFirebaseActive()) {
    await signOut(auth);
  }
};

export const subscribeAuth = (callback) => {
  if (isFirebaseActive()) {
    return onAuthStateChanged(auth, (user) => {
      callback(user || null);
    });
  } else {
    callback(null);
    return () => {};
  }
};

/* =========================================================================
   FIRESTORE CUSTOMER OPERATIONS (FIREBASE ONLY)
   ========================================================================= */

// Real-time listener for inquiries directly from Cloud Firestore
export const subscribeToCustomers = (onUpdate, onError) => {
  if (!isFirebaseActive()) {
    if (onError) {
      onError(new Error('Firebase Firestore is not connected. Configure your Firebase project in Settings.'));
    }
    return () => {};
  }

  // Primary collection name matching your Firebase Firestore setup
  const primaryCollection = 'leads';
  const leadsRef = collection(db, primaryCollection);

  return onSnapshot(
    leadsRef,
    (snapshot) => {
      const inquiries = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // If leads has data, sort and emit
      if (inquiries.length > 0) {
        inquiries.sort((a, b) => new Date(b.createdAt || b.dateAdded || 0) - new Date(a.createdAt || a.dateAdded || 0));
        onUpdate(inquiries);
      } else {
        // Check customers collection fallback
        getDocs(collection(db, 'customers')).then((fallbackSnap) => {
          if (!fallbackSnap.empty) {
            const fallbackInquiries = fallbackSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
            fallbackInquiries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            onUpdate(fallbackInquiries);
          } else {
            onUpdate([]);
          }
        }).catch(() => onUpdate([]));
      }
    },
    (error) => {
      console.warn('Firestore subscription error on leads:', error.message);
      if (onError) onError(error);
    }
  );
};

// Add a new customer / project inquiry directly to Cloud Firestore
export const addCustomerToDb = async (inquiryData) => {
  if (!isFirebaseActive()) {
    throw new Error('Firebase Firestore is not connected. Please connect Firebase to add records.');
  }

  const newInquiry = {
    companyName: (inquiryData.companyName || '').trim(),
    customerName: (inquiryData.customerName || inquiryData.name || '').trim(),
    phone: (inquiryData.phone || '').trim(),
    hasProject: Boolean(inquiryData.hasProject),
    projectType: inquiryData.hasProject ? (inquiryData.projectType || 'Mobile App') : '',
    status: inquiryData.status || 'New',
    notes: (inquiryData.notes || '').trim(),
    createdAt: new Date().toISOString()
  };

  const colRef = collection(db, 'leads');
  const docRef = await addDoc(colRef, {
    ...newInquiry,
    serverCreatedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return { id: docRef.id, ...newInquiry };
};

// Update an existing customer directly in Cloud Firestore
export const updateCustomerInDb = async (id, updateFields) => {
  if (!isFirebaseActive()) {
    throw new Error('Firebase Firestore is not connected. Please connect Firebase to update records.');
  }

  const docRef = doc(db, 'leads', id);
  await updateDoc(docRef, {
    ...updateFields,
    updatedAt: serverTimestamp()
  });
  return true;
};

// Delete a customer directly from Cloud Firestore
export const deleteCustomerFromDb = async (id) => {
  if (!isFirebaseActive()) {
    throw new Error('Firebase Firestore is not connected. Please connect Firebase to delete records.');
  }

  const docRef = doc(db, 'leads', id);
  await deleteDoc(docRef);
  return true;
};

// Log a call outcome & update calling status in Cloud Firestore
export const logCallOutcomeInDb = async (customerId, { outcome, note }) => {
  if (!isFirebaseActive()) {
    throw new Error('Firebase Firestore is not connected. Please connect Firebase to log calls.');
  }

  const callRecord = {
    id: 'call-' + Date.now(),
    timestamp: new Date().toISOString(),
    outcome: outcome,
    note: note || ''
  };

  const docRef = doc(db, 'leads', customerId);
  await updateDoc(docRef, {
    status: outcome,
    lastCalledAt: new Date().toISOString(),
    callHistory: arrayUnion(callRecord),
    notes: note ? (note + (note ? '\n' : '')) : ''
  });

  // Also write to global call_logs collection for team analytics
  try {
    await addDoc(collection(db, 'call_logs'), {
      customerId,
      ...callRecord,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Could not write global call log:', e);
  }

  return callRecord;
};

// Test Firebase configuration credentials live
export const testFirebaseCredentials = async (config) => {
  try {
    const tempApp = initializeApp(config, 'temp-connection-test-' + Date.now());
    const tempDb = getFirestore(tempApp);
    // Fetch attempt
    await getDocs(collection(tempDb, 'customers'));
    return { success: true, message: 'Successfully connected to Firebase Firestore!' };
  } catch (err) {
    return { 
      success: false, 
      message: err.message || 'Failed to connect. Please verify API key, Project ID, and Firestore permissions.' 
    };
  }
};

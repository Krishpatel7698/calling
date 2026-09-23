# CallPulse CRM - Customer Calling CRM Web App

A professional, modern, fully responsive Customer Calling CRM Web Application built with **React**, **Vanilla CSS**, and **Firebase Authentication & Cloud Firestore**.

---

## 🚀 Key Features

- **Mobile-First Calling**: Large, thumb-friendly Call buttons that dial directly using standard `tel:PHONE_NUMBER` protocol.
- **Call Disposition Workflow**: Automatically triggers a disposition prompt after dialing to update customer status (`Called`, `Interested`, `Not Interested`, `Call Later`, `Converted`) and log timestamped notes.
- **WhatsApp Integration**: Instant 1-tap WhatsApp chat opener (`https://wa.me/...`).
- **Dashboard & Analytics**:
  - 6 Key Metric Cards: Total Customers, New, Called, Interested, Call Later, Converted.
  - Interactive SVG Status Donut Chart.
  - Pipeline Conversion Funnel & Win Rate.
  - Call Later Queue with quick-dial actions.
- **Customer Directory**:
  - Live instant search across Customer Name, Phone, and Notes.
  - Filter chips: All, New, Called, Interested, Not Interested, Call Later, Converted.
  - Switch between Touch Card Grid view and Dense Table view.
  - Sorting: Newest, Oldest, Name (A–Z), Name (Z–A).
- **Responsive Layout**:
  - Collapsible desktop sidebar with brand & status badge.
  - Fixed mobile bottom navigation bar with thumb tabs for seamless smartphone usability.
- **Security & Cloud Persistence**:
  - Firebase Authentication for Admin Email & Password login.
  - Firebase Firestore for persistent cloud data storage.
  - Ready-to-deploy [`firestore.rules`](./firestore.rules) restricting access to authenticated users.
  - In-app Firebase credentials setup & live connection test.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vanilla CSS (Design Tokens, Glassmorphism, Micro-animations)
- **Tooling**: Vite
- **Icons**: Lucide Icons
- **Backend & Database**: Firebase v10+ (Authentication & Cloud Firestore)

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser or phone on local Wi-Fi.

---

## 🔐 Connecting Your Firebase Project

### Method 1: Through the In-App Setup or Settings Screen
1. Open the application (if Firebase keys are not in `.env.local`, click **Configure Firebase Keys** on the login screen).
2. Paste your Firebase project configuration (`apiKey`, `projectId`, etc.).
3. Click **Test Connection**, then click **Save & Connect**.
4. Log in with your admin user registered in Firebase Authentication.

### Method 2: Via `.env.local`
Create a `.env.local` file in the root folder:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules
Copy the rules from [`firestore.rules`](./firestore.rules) into your Firebase Console under **Firestore Database** > **Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }
    match /call_logs/{logId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 Project Structure

```
├── firestore.rules          # Firestore security rules
├── .env.example             # Example Firebase environment config
├── index.html               # Main HTML with SEO meta tags and Google fonts
├── src/
│   ├── main.jsx             # React entry point with Auth & Customer context
│   ├── App.jsx              # Main CRM application & view router
│   ├── styles/
│   │   └── index.css        # Modern CSS design system, dark-slate theme & responsive styles
│   ├── services/
│   │   └── firebase.js      # Firebase Client, Auth methods, and Cloud Firestore CRUD
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state & login/logout handlers
│   │   └── CustomerContext.jsx # Firestore customer sync, filters, and calling workflows
│   ├── components/
│   │   ├── Navbar.jsx       # Header with search, quick-add, and connection status
│   │   ├── Sidebar.jsx      # Desktop sidebar navigation
│   │   ├── MobileBottomNav.jsx # Sticky mobile bottom tab bar
│   │   ├── StatusBadge.jsx  # Color-coded CRM status pills
│   │   ├── StatsCard.jsx    # Metric card for dashboard statistics
│   │   ├── AnalyticsCharts.jsx # Interactive SVG donut & funnel charts
│   │   ├── CustomerCard.jsx # Mobile-first customer card with tel: call & WhatsApp
│   │   ├── CustomerTable.jsx# Desktop data table view
│   │   ├── CallDispositionModal.jsx # Post-call outcome logger and notes
│   │   ├── EditCustomerModal.jsx # Lead editing modal
│   │   └── Toast.jsx        # Notification alert banners
│   └── pages/
│       ├── Login.jsx        # Admin sign-in screen
│       ├── Dashboard.jsx    # Overview dashboard with analytics & quick-dial queue
│       ├── Customers.jsx    # Full customer directory with search & status filters
│       ├── AddCustomer.jsx  # Add new customer form with validation
│       ├── CustomerDetails.jsx # Detailed customer profile & call history timeline
│       └── Settings.jsx     # Firebase config manager, CSV export, and database reset
```

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { clearIndexedDbPersistence } from 'firebase/firestore';
import { db } from './firebase';

// Clear Firestore IndexedDB persistence to solve potential corruption issues.
clearIndexedDbPersistence(db).then(() => {
  console.log("Cleared Firestore IndexedDB persistence.");
}).catch(err => {
  console.error("Could not clear Firestore IndexedDB persistence:", err);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

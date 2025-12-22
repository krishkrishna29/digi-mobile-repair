import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App'; // Import AppWrapper from App.jsx
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster />
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>
);

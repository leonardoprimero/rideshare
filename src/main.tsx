import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store'; // Keeping for initializeDemoData (or if Provider was here)
// import { initializeAuth } from './store/slices/authSlice'; // Removed
// import { initializeDemoData } from './utils/initDemo'; // Commented out as initializeDemoData() is commented

// Inicializar estado de autenticación - This is now handled in App.tsx
// store.dispatch(initializeAuth()); // Removed

// Inicializar datos de demostración
// initializeDemoData(); // This might dispatch actions, so store import could be needed. // Commented out

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

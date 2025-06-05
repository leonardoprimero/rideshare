import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { initializeDemoData } from './utils/initDemo';

// Inicializar estado de autenticación
store.dispatch(initializeAuth());

// Inicializar datos de demostración
initializeDemoData();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

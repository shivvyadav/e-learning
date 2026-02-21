import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { AdminProvider } from './context/AdminContext';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </React.StrictMode>
);


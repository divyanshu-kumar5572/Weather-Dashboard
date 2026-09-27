// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import BrowserRouter from the library we installed.
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the entire App component with BrowserRouter.
        This enables routing capabilities for all child components. */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
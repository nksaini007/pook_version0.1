import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import React from 'react'
import { AuthProvider } from './assets/context/AuthContext.jsx';
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
           <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);
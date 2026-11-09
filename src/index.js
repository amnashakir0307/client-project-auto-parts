import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/i18n'; // <-- Ye line add karni hai
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
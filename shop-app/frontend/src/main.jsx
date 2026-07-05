// ============================================================
// FILE: frontend/src/main.jsx
// PURPOSE: The entry point of the React application.
// It mounts the root React component (<App />) into the
// #root div found in index.html.
// StrictMode helps catch bugs during development.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

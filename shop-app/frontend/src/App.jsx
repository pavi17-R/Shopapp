// ============================================================
// FILE: frontend/src/App.jsx
// PURPOSE: The root component of the React application.
// Sets up React Router — all page routes are defined here.
// Also includes a ProtectedRoute component that redirects
// unauthenticated users to the login page.
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// -------------------------------------------------------
// ProtectedRoute: A wrapper component.
// If the user is NOT logged in, redirects to /login.
// If logged in, renders the child component normally.
// Usage: <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
// -------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  // If no user found in localStorage, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// -------------------------------------------------------
// App: The main application shell.
// BrowserRouter enables client-side routing.
// Routes maps each URL path to a page component.
// -------------------------------------------------------
const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar is shown on every page */}
      <Navbar />

      {/* Main content area — all pages render here */}
      <main>
        <Routes>
          {/* Public Routes — anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected Routes — only logged-in users */}
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Catch-all: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer is shown on every page */}
      <Footer />
    </BrowserRouter>
  );
};

export default App;

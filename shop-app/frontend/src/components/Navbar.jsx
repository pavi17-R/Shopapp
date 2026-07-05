// ============================================================
// FILE: frontend/src/components/Navbar.jsx
// PURPOSE: The top navigation bar shown on every page.
// Shows nav links and reacts to the user's login state.
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';

// ---- STYLES (component-scoped, written as a style object) ----
const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--color-border)',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
  },
  navLink: {
    padding: '7px 12px',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
  },
  activeLink: {
    color: 'var(--color-primary)',
    background: 'var(--color-primary-light)',
  },
  logoutBtn: {
    padding: '7px 16px',
    background: 'var(--color-surface-2)',
    color: 'var(--color-text)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
};

// ---- COMPONENT ----
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();  // Get user from localStorage

  const handleLogout = () => {
    logout();  // Clears localStorage
    navigate('/login');
  };

  // Helper: check if a path is the current route
  const isActive = (path) => location.pathname === path;

  // Dynamic style for nav links
  const linkStyle = (path) => ({
    ...styles.navLink,
    ...(isActive(path) ? styles.activeLink : {}),
    textDecoration: 'none',
    display: 'inline-block',
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo */}
        <Link to="/" style={styles.logo}>ShopApp</Link>

        {/* Navigation Links */}
        <ul style={styles.links}>
          <li><Link to="/" style={linkStyle('/')}>Home</Link></li>

          {user ? (
            // Show these links only when logged in
            <>
              <li><Link to="/cart" style={linkStyle('/cart')}>🛒 Cart</Link></li>
              <li><Link to="/wishlist" style={linkStyle('/wishlist')}>♡ Wishlist</Link></li>
              <li><Link to="/orders" style={linkStyle('/orders')}>📦 Orders</Link></li>
              <li><Link to="/profile" style={linkStyle('/profile')}>👤 {user.name}</Link></li>
              <li>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Show Login/Register when not logged in
            <>
              <li><Link to="/login" style={linkStyle('/login')}>Login</Link></li>
              <li>
                <Link
                  to="/register"
                  style={{
                    ...styles.navLink,
                    background: 'var(--color-primary)',
                    color: 'white',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;

// ============================================================
// FILE: frontend/src/components/Footer.jsx
// PURPOSE: A simple footer displayed at the bottom of every page.
// ============================================================

import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <span style={styles.brand}>ShopApp</span>
        <span style={styles.copy}>
          © {new Date().getFullYear()} Built for learning Full Stack Development
        </span>
        <div style={styles.links}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/cart" style={styles.link}>Cart</a>
          <a href="/orders" style={styles.link}>Orders</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    padding: '28px 20px',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    color: 'var(--color-primary)',
  },
  copy: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
  },
};

export default Footer;

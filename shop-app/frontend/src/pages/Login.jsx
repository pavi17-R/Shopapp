// ============================================================
// FILE: frontend/src/pages/Login.jsx
// PURPOSE: The login page. Contains a form that sends
// credentials to the API and stores the JWT on success.
// ============================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  // Controlled form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default browser form submission

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // On success, navigate to home page
      navigate('/');
    } catch (err) {
      // Show the error message from the server, or a fallback
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your ShopApp account</p>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'var(--color-bg)',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--shadow-md)',
  },
  header: {
    marginBottom: '28px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    marginBottom: '6px',
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: '14px',
  },
  footerText: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
  },
  link: {
    color: 'var(--color-primary)',
    fontWeight: '500',
  },
};

export default Login;

// ============================================================
// FILE: frontend/src/pages/Home.jsx
// PURPOSE: The main landing page. Shows a product grid with
// search and category filter functionality.
// ============================================================

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/productService';

const Home = () => {
  // State variables
  const [products, setProducts] = useState([]);       // All fetched products
  const [categories, setCategories] = useState([]);   // Available categories
  const [search, setSearch] = useState('');           // Search input value
  const [category, setCategory] = useState('');       // Selected category
  const [loading, setLoading] = useState(true);       // Loading state
  const [error, setError] = useState('');             // Error message

  // Fetch products whenever search or category changes
  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts(search, category);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Could not load categories.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ---- Hero Banner ---- */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Discover Something New</h1>
          <p style={styles.heroSubtitle}>Browse our curated collection of quality products</p>
        </div>

        {/* ---- Search & Filter Bar ---- */}
        <div style={styles.filterBar}>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          {/* Category dropdown */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Clear filters button */}
          {(search || category) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(''); setCategory(''); }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ---- Results Count ---- */}
        <p style={styles.resultsCount}>
          {!loading && `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>

        {/* ---- Error Message ---- */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* ---- Loading Spinner ---- */}
        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
          </div>
        )}

        {/* ---- Products Grid ---- */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search term or category</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div style={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-surface-2) 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: '48px 40px',
    marginBottom: '32px',
    border: '1px solid var(--color-border)',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '38px',
    color: 'var(--color-text)',
    marginBottom: '10px',
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    flex: '1',
    minWidth: '220px',
    padding: '10px 16px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    background: 'var(--color-surface)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  },
  select: {
    padding: '10px 14px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  resultsCount: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
};

export default Home;

// ============================================================
// FILE: frontend/src/components/ProductCard.jsx
// PURPOSE: A reusable card component that displays one product.
// Used on the Home page in a grid.
// Receives a `product` object as a prop.
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../services/cartService';
import { getCurrentUser } from '../services/authService';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // When "Add to Cart" is clicked
  const handleAddToCart = async (e) => {
    // Stop the click from bubbling up to the card (which navigates)
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id);
      alert(`"${product.name}" added to cart!`);
    } catch (err) {
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Product Image */}
      <div style={styles.imageWrapper}>
        <img
          src={product.image_url}
          alt={product.name}
          style={styles.image}
          onError={e => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
        {/* Category badge */}
        <span style={styles.categoryBadge}>{product.category}</span>
      </div>

      {/* Product Info */}
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>
          {product.description?.length > 80
            ? product.description.slice(0, 80) + '...'
            : product.description}
        </p>
        <div style={styles.footer}>
          <span style={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
          <button
            style={styles.addBtn}
            onClick={handleAddToCart}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- INLINE STYLES ----
const styles = {
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: 'var(--shadow-sm)',
  },
  imageWrapper: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    background: 'var(--color-surface-2)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(255,255,255,0.9)',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  body: {
    padding: '16px',
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '6px',
    color: 'var(--color-text)',
    lineHeight: '1.4',
  },
  description: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '14px',
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    color: 'var(--color-primary)',
  },
  addBtn: {
    padding: '7px 14px',
    background: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default ProductCard;

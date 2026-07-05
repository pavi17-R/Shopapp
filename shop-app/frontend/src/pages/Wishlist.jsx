// ============================================================
// FILE: frontend/src/pages/Wishlist.jsx
// PURPOSE: Shows products saved to the user's wishlist.
// Allows moving items to cart or removing from wishlist.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToCart } from '../services/cartService';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data);
    } catch (err) {
      console.error('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (err) {
      alert('Failed to remove from wishlist.');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));
      alert('Moved to cart!');
    } catch (err) {
      alert('Failed to move to cart.');
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love to buy them later</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Discover Products
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map(item => (
              <div key={item.wishlist_id} style={styles.card}>

                {/* Image */}
                <div style={styles.imageWrapper}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={styles.image}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    onError={e => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                  />
                </div>

                {/* Info */}
                <div style={styles.body}>
                  <h3
                    style={styles.name}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    {item.name}
                  </h3>
                  <p style={styles.price}>${parseFloat(item.price).toFixed(2)}</p>

                  {/* Actions */}
                  <div style={styles.actions}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleMoveToCart(item.product_id)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  imageWrapper: { height: '180px', overflow: 'hidden', background: 'var(--color-surface-2)' },
  image: { width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' },
  body: { padding: '16px' },
  name: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    cursor: 'pointer',
    lineHeight: '1.4',
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '17px',
    color: 'var(--color-primary)',
    marginBottom: '12px',
  },
  actions: { display: 'flex', gap: '8px' },
};

export default Wishlist;

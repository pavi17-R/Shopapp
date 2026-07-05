// ============================================================
// FILE: frontend/src/pages/ProductDetails.jsx
// PURPOSE: Displays full details of a single product.
// Gets the product ID from the URL params.
// Allows adding to cart and wishlist.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart, addToWishlist } from '../services/cartService';
import { getCurrentUser } from '../services/authService';

const ProductDetails = () => {
  // useParams gets the :id value from the URL "/product/:id"
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState('');
  const [wishMsg, setWishMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await addToCart(product.id, quantity);
      setCartMsg('Added to cart! ✓');
      setTimeout(() => setCartMsg(''), 2500);
    } catch (err) {
      setCartMsg('Failed to add to cart.');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      await addToWishlist(product.id);
      setWishMsg('Added to wishlist! ♡');
      setTimeout(() => setWishMsg(''), 2500);
    } catch (err) {
      setWishMsg(err.response?.data?.message || 'Failed to add to wishlist.');
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;
  if (error) return <div className="container" style={{ padding: '60px 20px' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Back button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '24px' }}
        >
          ← Back
        </button>

        <div style={styles.layout}>

          {/* Left: Product Image */}
          <div style={styles.imageWrapper}>
            <img
              src={product.image_url}
              alt={product.name}
              style={styles.image}
              onError={e => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
            />
          </div>

          {/* Right: Product Info */}
          <div style={styles.info}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.price}>${parseFloat(product.price).toFixed(2)}</p>
            <p style={styles.description}>{product.description}</p>

            {/* Stock info */}
            <p style={styles.stock}>
              {product.stock > 0
                ? <span style={{ color: 'var(--color-success)' }}>✓ In stock ({product.stock} available)</span>
                : <span style={{ color: 'var(--color-danger)' }}>✕ Out of stock</span>
              }
            </p>

            {/* Quantity Selector */}
            <div style={styles.quantityRow}>
              <label style={styles.qtyLabel}>Quantity:</label>
              <div style={styles.qtyControl}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <button
                className="btn btn-outline"
                onClick={handleAddToWishlist}
              >
                ♡ Wishlist
              </button>
            </div>

            {/* Feedback messages */}
            {cartMsg && <div className="alert alert-success" style={{ marginTop: '12px' }}>{cartMsg}</div>}
            {wishMsg && <div className="alert alert-success" style={{ marginTop: '12px' }}>{wishMsg}</div>}

          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start',
  },
  imageWrapper: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-2)',
  },
  image: {
    width: '100%',
    height: '420px',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  category: {
    display: 'inline-block',
    background: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '14px',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: '30px',
    marginBottom: '12px',
    lineHeight: '1.3',
  },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    color: 'var(--color-primary)',
    marginBottom: '16px',
  },
  description: {
    color: 'var(--color-text-muted)',
    lineHeight: '1.7',
    marginBottom: '16px',
    fontSize: '15px',
  },
  stock: { marginBottom: '20px', fontSize: '14px' },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  qtyLabel: { fontSize: '14px', fontWeight: '500', color: 'var(--color-text-muted)' },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    background: 'var(--color-surface-2)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    fontFamily: 'var(--font-body)',
  },
  qtyValue: {
    width: '44px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '15px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
};

export default ProductDetails;

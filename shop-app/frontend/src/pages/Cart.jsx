// ============================================================
// FILE: frontend/src/pages/Cart.jsx
// PURPOSE: Shows all items in the user's cart.
// Allows updating quantities, removing items, and checking out.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../services/cartService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (err) {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  // Update a cart item's quantity
  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(cartId, newQty);
      // Update local state so UI re-renders immediately (no refetch needed)
      setCartItems(prev =>
        prev.map(item => item.cart_id === cartId ? { ...item, quantity: newQty } : item)
      );
    } catch (err) {
      alert('Failed to update quantity.');
    }
  };

  // Remove an item from cart
  const handleRemove = async (cartId) => {
    try {
      await removeFromCart(cartId);
      setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  // Calculate total price from current cart items
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse our products and add something you love</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Browse Products
            </button>
          </div>
        )}

        {cartItems.length > 0 && (
          <div style={styles.layout}>

            {/* ---- Cart Items List ---- */}
            <div style={styles.itemsList}>
              {cartItems.map(item => (
                <div key={item.cart_id} style={styles.cartItem}>

                  {/* Product Image */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={styles.itemImage}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  />

                  {/* Product Info */}
                  <div style={styles.itemInfo}>
                    <h3
                      style={styles.itemName}
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      {item.name}
                    </h3>
                    <p style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.qtyControl}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                    >−</button>
                    <span style={styles.qtyValue}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                    >+</button>
                  </div>

                  {/* Subtotal */}
                  <div style={styles.subtotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <button
                    style={styles.removeBtn}
                    onClick={() => handleRemove(item.cart_id)}
                    title="Remove item"
                  >
                    ✕
                  </button>

                </div>
              ))}
            </div>

            {/* ---- Order Summary ---- */}
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              <div style={styles.summaryRow}>
                <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: 'var(--color-success)' }}>Free</span>
              </div>

              <div style={styles.summaryDivider}></div>

              <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => navigate('/orders')}
              >
                Proceed to Checkout →
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '28px',
    alignItems: 'start',
  },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius)',
    objectFit: 'cover',
    cursor: 'pointer',
    flexShrink: '0',
    background: 'var(--color-surface-2)',
  },
  itemInfo: { flex: '1', minWidth: '0' },
  itemName: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemPrice: { fontSize: '13px', color: 'var(--color-text-muted)' },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    flexShrink: '0',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    background: 'var(--color-surface-2)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'var(--font-body)',
  },
  qtyValue: { width: '36px', textAlign: 'center', fontWeight: '600', fontSize: '14px' },
  subtotal: { fontWeight: '600', fontSize: '15px', width: '72px', textAlign: 'right', flexShrink: '0' },
  removeBtn: {
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    border: 'none',
    borderRadius: 'var(--radius)',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    flexShrink: '0',
  },
  summary: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: '88px',
  },
  summaryTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    marginBottom: '12px',
  },
  summaryDivider: {
    height: '1px',
    background: 'var(--color-border)',
    margin: '16px 0',
  },
};

export default Cart;

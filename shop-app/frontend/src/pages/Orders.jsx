// ============================================================
// FILE: frontend/src/pages/Orders.jsx
// PURPOSE: Two views in one page:
//   1. Checkout form — enter address and place an order
//   2. Order history — view all past orders
// ============================================================

import React, { useState, useEffect } from 'react';
import { getOrders, placeOrder, getCart } from '../services/cartService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('checkout');  // 'checkout' or 'history'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersData, cartData] = await Promise.all([
        getOrders(),
        getCart()
      ]);
      setOrders(ordersData);
      setCartCount(cartData.reduce((s, i) => s + i.quantity, 0));
    } catch (err) {
      console.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return setError('Please enter a shipping address.');

    setPlacing(true);
    setError('');
    try {
      const result = await placeOrder(address);
      setSuccess(`Order #${result.orderId} placed! Total: $${result.totalPrice}`);
      setAddress('');
      setCartCount(0);
      // Refresh order history
      const ordersData = await getOrders();
      setOrders(ordersData);
      setActiveTab('history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Color for order status badge
  const statusColor = (status) => {
    const colors = {
      pending: '#d97706',
      processing: '#2563eb',
      shipped: '#7c3aed',
      delivered: '#16a34a',
    };
    return colors[status] || '#666';
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '760px' }}>

        {/* ---- Tab Header ---- */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'checkout' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('checkout')}
          >
            🛒 Checkout
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'history' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('history')}
          >
            📦 Order History ({orders.length})
          </button>
        </div>

        {/* ---- CHECKOUT TAB ---- */}
        {activeTab === 'checkout' && (
          <div className="card">
            <h2 style={styles.sectionTitle}>Place Your Order</h2>

            {cartCount === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add items to your cart before checking out</p>
              </div>
            ) : (
              <>
                <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>
                  You have <strong>{cartCount} item{cartCount > 1 ? 's' : ''}</strong> in your cart ready to order.
                </p>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label>Shipping Address</label>
                    <textarea
                      rows={4}
                      placeholder="Enter your full shipping address..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    disabled={placing}
                  >
                    {placing ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ---- ORDER HISTORY TAB ---- */}
        {activeTab === 'history' && (
          <div>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here after you place an order</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => (
                  <div key={order.id} className="card">

                    {/* Order Header */}
                    <div style={styles.orderHeader}>
                      <div>
                        <h3 style={styles.orderId}>Order #{order.id}</h3>
                        <p style={styles.orderDate}>{formatDate(order.created_at)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ ...styles.statusBadge, background: statusColor(order.status) + '20', color: statusColor(order.status) }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p style={styles.orderTotal}>${parseFloat(order.total_price).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={styles.orderItems}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={styles.orderItem}>
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={styles.orderItemImg}
                            onError={e => { e.target.src = 'https://placehold.co/60x60?text=?'; }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <p style={{ fontWeight: '600', fontSize: '14px' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <p style={styles.shippingAddr}>
                      <strong>Ship to:</strong> {order.shipping_address}
                    </p>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: 'var(--color-surface-2)',
    padding: '6px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
  },
  tab: {
    flex: 1,
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    boxShadow: 'var(--shadow-sm)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    marginBottom: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  orderId: { fontWeight: '700', fontSize: '16px', marginBottom: '3px' },
  orderDate: { fontSize: '13px', color: 'var(--color-text-muted)' },
  orderTotal: { fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-primary)', marginTop: '4px' },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  orderItems: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '14px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  orderItemImg: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius)',
    objectFit: 'cover',
    background: 'var(--color-surface-2)',
  },
  shippingAddr: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '12px',
  },
};

export default Orders;

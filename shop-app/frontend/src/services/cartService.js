// ============================================================
// FILE: frontend/src/services/cartService.js
// PURPOSE: All API calls related to cart, wishlist, and orders.
// ============================================================

import axios from 'axios';
import { authHeader } from './authService';

const API = 'http://localhost:5000/api';

// ---- CART ----
export const getCart = async () => {
  const res = await axios.get(`${API}/cart`, authHeader());
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axios.post(`${API}/cart`, { product_id: productId, quantity }, authHeader());
  return res.data;
};

export const updateCartItem = async (cartId, quantity) => {
  const res = await axios.put(`${API}/cart/${cartId}`, { quantity }, authHeader());
  return res.data;
};

export const removeFromCart = async (cartId) => {
  const res = await axios.delete(`${API}/cart/${cartId}`, authHeader());
  return res.data;
};

export const clearCart = async () => {
  const res = await axios.delete(`${API}/cart/clear`, authHeader());
  return res.data;
};

// ---- WISHLIST ----
export const getWishlist = async () => {
  const res = await axios.get(`${API}/wishlist`, authHeader());
  return res.data;
};

export const addToWishlist = async (productId) => {
  const res = await axios.post(`${API}/wishlist`, { product_id: productId }, authHeader());
  return res.data;
};

export const removeFromWishlist = async (productId) => {
  const res = await axios.delete(`${API}/wishlist/${productId}`, authHeader());
  return res.data;
};

// ---- ORDERS ----
export const placeOrder = async (shippingAddress) => {
  const res = await axios.post(`${API}/orders`, { shipping_address: shippingAddress }, authHeader());
  return res.data;
};

export const getOrders = async () => {
  const res = await axios.get(`${API}/orders`, authHeader());
  return res.data;
};

// ============================================================
// FILE: frontend/src/services/authService.js
// PURPOSE: Centralizes all API calls related to authentication.
// By keeping API logic here (not in components), our pages stay
// clean and we only change the API call in ONE place if needed.
// ============================================================

import axios from 'axios';

// Base URL for all API requests
const API = 'http://localhost:5000/api';

// -------------------------------------------------------
// Helper: Get the stored JWT token from localStorage
// -------------------------------------------------------
const getToken = () => localStorage.getItem('token');

// -------------------------------------------------------
// Helper: Returns an axios config object with the
// Authorization header set to our JWT token.
// -------------------------------------------------------
export const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Register a new user
export const register = async (name, email, password) => {
  const res = await axios.post(`${API}/auth/register`, { name, email, password });
  return res.data;
};

// Login and store token + user in localStorage
export const login = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  // Store the token so it persists across page refreshes
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

// Remove token and user from localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage (no API call needed)
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get full profile from server (includes phone, address)
export const getProfile = async () => {
  const res = await axios.get(`${API}/auth/profile`, authHeader());
  return res.data;
};

// Update profile details
export const updateProfile = async (data) => {
  const res = await axios.put(`${API}/auth/profile`, data, authHeader());
  return res.data;
};

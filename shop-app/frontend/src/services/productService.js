// ============================================================
// FILE: frontend/src/services/productService.js
// PURPOSE: All API calls related to products.
// ============================================================

import axios from 'axios';

const API = 'http://localhost:5000/api';

// Fetch all products. Optionally pass search string or category.
export const getProducts = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const res = await axios.get(`${API}/products`, { params });
  return res.data;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  const res = await axios.get(`${API}/products/${id}`);
  return res.data;
};

// Fetch all distinct product categories
export const getCategories = async () => {
  const res = await axios.get(`${API}/products/categories`);
  return res.data;
};

// ============================================================
// FILE: backend/routes/productRoutes.js
// PURPOSE: Maps product-related URL endpoints to controller functions.
// All product routes are public — no login needed to browse.
// ============================================================

const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getCategories } = require('../controllers/productController');

// GET /api/products             → list all (supports ?search= and ?category=)
// GET /api/products/categories  → list all categories
// GET /api/products/:id         → single product details

router.get('/categories', getCategories);   // must come before /:id to avoid conflict
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;

// ============================================================
// FILE: backend/routes/orderRoutes.js
// PURPOSE: Routes for orders and wishlist.
// All routes are protected.
// ============================================================

const express = require('express');
const router = express.Router();
const {
  placeOrder, getOrders,
  getWishlist, addToWishlist, removeFromWishlist
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Order routes
router.post('/orders', placeOrder);
router.get('/orders', getOrders);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;

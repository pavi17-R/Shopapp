// ============================================================
// FILE: backend/routes/cartRoutes.js
// PURPOSE: Cart endpoint routing. All cart routes are protected
// (user must be logged in) — authMiddleware is applied globally.
// ============================================================

const express = require('express');
const router = express.Router();
const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to ALL routes in this file
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:cartId', updateCartItem);
router.delete('/clear', clearCart);         // must come before /:cartId
router.delete('/:cartId', removeFromCart);

module.exports = router;

const router = require('express').Router();
const verifyToken = require('./authMiddleware');
const orderController = require('../controllers/orderController');

// Since server.js prefixes with /api/user/orders, 
// this route handles POST /api/user/orders/submit-order
router.post('/submit-order', verifyToken, orderController.submitOrder);

module.exports = router;
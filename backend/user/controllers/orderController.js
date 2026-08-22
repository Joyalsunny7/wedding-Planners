const Order = require('../models/order');

const createOrder = async (req, res) => {
  try {
    console.log('Received order payload:', req.body);
    console.log('Authenticated user:', req.user);

    // 1. Check if the user is authenticated via middleware
    if (!req.user || !req.user._id && !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. You must be logged in to submit an order.'
      });
    }

    // 2. Attach the user's ID from the token/session to the order data
    const orderData = {
      ...req.body,
      userId: req.user._id || req.user.id // Assumes your Order schema has a 'userId' field
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Event booking inquiry submitted successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error saving order to MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error. Please try again later.' 
    });
  }
};

const submitOrder = async (req, res) => {
  try {
    // Apply the same check here if you use submitOrder elsewhere
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    console.log("Incoming order data:", req.body);
    const newOrder = new Order({
      ...req.body,
      userId: req.user._id || req.user.id
    });
    
    await newOrder.save();
    res.status(201).json({ success: true, message: "Order saved successfully!" });
  } catch (error) {
    console.error("DETAILED SERVER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  submitOrder,
};
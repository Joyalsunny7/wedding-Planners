const Order = require('../models/order');

const createOrder = async (req, res) => {
  try {
    console.log('Received order payload:', req.body);

    const newOrder = new Order(req.body);
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
    console.log("Incoming order data:", req.body);
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, message: "Order saved successfully!" });
  } catch (error) {
    console.error("DETAILED SERVER ERROR:", error); // <-- Check your terminal for this log
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
};
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pax: { type: Number, required: true },
  functionType: { type: String, required: true },
  serviceType: [{ type: String }],
  mealType: [{ type: String }],
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
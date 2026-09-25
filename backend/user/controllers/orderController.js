const Order = require('../models/order');
const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const createOrder = async (req, res) => {
  try {
    console.log('Received order payload:', req.body);
    console.log('Authenticated user:', req.user);

    // 1. Check if the user is authenticated via middleware
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. You must be logged in to submit an order.'
      });
    }

    // 2. Attach the user's ID from the token/session to the order data
    const orderData = {
      ...req.body,
      userId: req.user._id || req.user.id 
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // 3. Extract user info and order payload details
    const userEmail = req.user.email; 
    const signedUserName = req.user.name || req.body.fullName || 'Valued User';
    const adminEmail = process.env.EMAIL_USER; 

    // Destructure fields from req.body for clean formatting
    const { fullName, phone, pax, serviceType, mealType, location, eventDate, functionType } = req.body;

    // 4. Define email content for the USER
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Event Booking Confirmation - Thank you!',
      html: `
        <h2>Hi ${signedUserName},</h2>
        <p>Your event booking has been successfully placed! Here are your order details:</p>
        <ul>
          <li><strong>Order ID:</strong> ${newOrder._id}</li>
          <li><strong>Full Name:</strong> ${fullName || 'N/A'}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
          <li><strong>Function Type:</strong> ${functionType || 'N/A'}</li>
          <li><strong>Event Date:</strong> ${eventDate || 'N/A'}</li>
          <li><strong>Location:</strong> ${location || 'N/A'}</li>
          <li><strong>Number of Guests (Pax):</strong> ${pax || 'N/A'}</li>
          <li><strong>Service Type:</strong> ${Array.isArray(serviceType) ? serviceType.join(', ') : (serviceType || 'N/A')}</li>
          <li><strong>Meal Type:</strong> ${Array.isArray(mealType) ? mealType.join(', ') : (mealType || 'N/A')}</li>
        </ul>
        <p>We will get in touch with you soon regarding your event.</p>
        <br>
        <p>Best regards,<br>Your Website Team</p>
      `
    };

    // 5. Define email content for the ADMIN (EMAIL_USER) with signed-in user's name in heading
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail, 
      subject: `New Order Placed by "${signedUserName}"`,
      html: `
        <h2>New Order Alert</h2>
        <p>An order has been placed by signed-in user: <strong>${signedUserName}</strong> (${userEmail})</p>
        <h3>Complete Order Details:</h3>
        <ul>
          <li><strong>Order ID:</strong> ${newOrder._id}</li>
          <li><strong>Full Name:</strong> ${fullName || 'N/A'}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
          <li><strong>Function Type:</strong> ${functionType || 'N/A'}</li>
          <li><strong>Event Date:</strong> ${eventDate || 'N/A'}</li>
          <li><strong>Location:</strong> ${location || 'N/A'}</li>
          <li><strong>Number of Guests (Pax):</strong> ${pax || 'N/A'}</li>
          <li><strong>Service Type:</strong> ${Array.isArray(serviceType) ? serviceType.join(', ') : (serviceType || 'N/A')}</li>
          <li><strong>Meal Type:</strong> ${Array.isArray(mealType) ? mealType.join(', ') : (mealType || 'N/A')}</li>
        </ul>
        <p>Check your database or admin panel to manage this request.</p>
      `
    };

    // 6. Send both emails simultaneously
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    res.status(201).json({
      success: true,
      message: 'Order saved and emails sent to user and admin successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error in createOrder (DB or Email):', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error. Please try again later.' 
    });
  }
};

const submitOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    console.log("Incoming order data:", req.body);
    const newOrder = new Order({
      ...req.body,
      userId: req.user._id || req.user.id
    });
    
    await newOrder.save();

    const userEmail = req.user.email;
    const signedUserName = req.user.name || req.body.fullName || 'Valued User';
    const adminEmail = process.env.EMAIL_USER;
    const { fullName, phone, pax, serviceType, mealType, location, eventDate, functionType } = req.body;

    // Send emails with full details
    await Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Event Booking Confirmation',
        html: `
          <h2>Hi ${signedUserName},</h2>
          <p>Your order #${newOrder._id} was submitted successfully!</p>
          <p><strong>Function:</strong> ${functionType} on ${eventDate}</p>
        `
      }),
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Order Placed by "${signedUserName}"`,
        html: `
          <h2>New Order from ${signedUserName}</h2>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Function:</strong> ${functionType} (${pax} Pax) at ${location}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
        `
      })
    ]);

    res.status(201).json({ success: true, message: "Order saved and emails sent successfully!" });
  } catch (error) {
    console.error("DETAILED SERVER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  submitOrder,
};
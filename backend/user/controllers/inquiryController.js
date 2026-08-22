const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

const submitInquiry = async (req, res) => {
  try {
    // 1. Check if the user is authenticated via middleware
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. You must be logged in to submit an inquiry." 
      });
    }

    const { clientName, clientEmail, phone, location, eventDate, message } = req.body;

    if (!clientName || !clientEmail || !phone || !location || !eventDate || !message) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // 2. Save the inquiry to MongoDB, optionally including the userId
    const newInquiry = new Inquiry({
      clientName,
      clientEmail,
      phone,
      location,
      eventDate,
      message,
      userId: req.user._id || req.user.id // Links inquiry to logged-in user if your schema supports it
    });
    await newInquiry.save();

    // 3. Initialize Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '',
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : ''
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'skseventz11@gmail.com',
      subject: `New Wedding Inquiry from ${clientName}`,
      html: `
        <h2>New Event Inquiry Received</h2>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location / Venue:</strong> ${location}</p>
        <p><strong>Event Date:</strong> ${eventDate}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    };

    // 4. Send email notification
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ success: true, message: "Inquiry saved and sent successfully!" });
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return res.status(500).json({ message: "Server error while processing your inquiry." });
  }
};

module.exports = {
  submitInquiry
};
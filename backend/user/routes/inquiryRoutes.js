const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/submit', async (req, res) => {
  try {
    // Destructured 'location' along with the other fields from req.body
    const { clientName, clientEmail, phone, location, eventDate, message } = req.body;

    // Added 'location' to the validation check
    if (!clientName || !clientEmail || !phone || !location || !eventDate || !message) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

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
      to: 'joyalsunny7117@gmail.com', // Replace with your real alternate email for testing if needed
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

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Inquiry sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ message: "Server error while sending email." });
  }
});

module.exports = router;
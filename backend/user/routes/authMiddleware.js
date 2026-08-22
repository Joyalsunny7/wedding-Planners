const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from Authorization header (e.g., "Bearer <token>")
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. No token provided or invalid format." 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your JWT secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user payload to the request object so controllers can access it
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token." 
    });
  }
};

module.exports = verifyToken;
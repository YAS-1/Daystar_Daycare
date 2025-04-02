import jwt from 'jsonwebtoken';
import db from '../config/db.config.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in the managers table
    const [users] = await db.query('SELECT * FROM managers WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }
    
    // Attach user data (excluding password) to request object
    const { password, ...userData } = users[0];
    req.user = userData;
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token'
      });
    }
    console.error('Error in protectRoute middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// This function handles JWT token generation and sets the token as an HTTP-only cookie
// Utils - Token generation
import jwt from 'jsonwebtoken'; 

const generateTokenAndSetCookie = (id, res) => {
  // Create token payload
  const payload = {
    id
  };
  
  // Generate token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // Make sure to set this in your .env file
    { expiresIn: '30d' } // Token expires in 30 days
  );
  
  // Set cookie
  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Protection against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expiry set to match token (30 days)
  });
  
  return token;
};

export default generateTokenAndSetCookie;
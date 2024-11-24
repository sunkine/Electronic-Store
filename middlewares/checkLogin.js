import jwt from "jsonwebtoken";

// Updated verifyToken to use async/await and return a promise
export const verifyToken = async (token) => {
  try {
    // Verify token asynchronously and return decoded data
    const decoded = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (err) {
    // Return false if there's an error (invalid or expired token)
    return false;
  }
};

// Function to extract token from the Authorization header
export const getTokenFromHeader = (req) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return null;
  }
  return token;
};

// Middleware to check if the user is logged in by verifying the token
export const isLoggedin = async (req, res, next) => {
  const token = getTokenFromHeader(req); // Get token from header

  if (!token) {
    return res.status(401).json({ message: "No token provided, please login" });
  }

  // Verify the token and decode the user information
  const decodedUser = await verifyToken(token);

  if (!decodedUser) {
    return res
      .status(401)
      .json({ message: "Invalid/Expired Token, please login again" });
  }

  // Save the user ID in the request object to access it in the route handler
  req.userAuthId = decodedUser._id;
  next();
};

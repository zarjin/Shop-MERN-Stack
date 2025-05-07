import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request object
    req.user = decoded;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuthenticated;

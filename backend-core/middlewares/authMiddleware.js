const jwt = require("jsonwebtoken");
const axios = require("axios");

/**
 * Middleware to protect routes by verifying JWT and populating req.user.
 */
const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    // Call the .NET API to get user details
    const dotNetApiUrl = `${process.env.USER_SERVICE_URL}/api/users/${decoded.nameid}`;
    const userResponse = await axios.get(dotNetApiUrl);

    if (userResponse.status !== 200 || !userResponse.data) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Populate req.user with user data from the .NET service
    req.user = userResponse.data;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // console.error("Error in authentication middleware:", error);

    // Handle specific cases like expired token or connection issues
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "User not found" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }

    return res
      .status(500)
      .json({ message: "Internal server error in authentication" });
  }
};

module.exports = protectRoute;

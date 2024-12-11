const jwt = require("jsonwebtoken");
const prisma = require("@prisma/client").PrismaClient;

const prismaClient = new prisma();

/**
 * Middleware to protect routes by verifying JWT and populating req.user.
 */
const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database
    const user = await prismaClient.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Populate req.user with user data
    req.user = user
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = protectRoute;

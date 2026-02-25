const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prismaClient = require("../db/prismaClient");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prismaClient.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    // Generate a JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged in successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = { signup, login, logout };

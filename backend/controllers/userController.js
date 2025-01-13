const prisma = require("@prisma/client").PrismaClient;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../helpers/sendEmail");

const prismaClient = new prisma();

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming req.user is populated by middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { nickname } = req.body;
    const profilePicture = req.file?.path; // File path from multer

    // Prepare update data
    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (profilePicture) updateData.profilePicture = profilePicture;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({ message: "No changes made. Profile is up-to-date." });
    }

    // Perform the update
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile." });
  }
};


// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetCode } = req.body;

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.resetCode !== resetCode) {
      return res.status(400).json({ message: "Invalid reset code." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prismaClient.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetCode: null, // Clear the reset code
      },
    });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

// Send reset code via email
const sendResetCode = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the user exists
      const user = await prismaClient.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      // Generate a reset code
      const resetCode = uuidv4().slice(0, 6); // Generate a 6-character reset code
      await prismaClient.user.update({
        where: { email },
        data: { resetCode },
      });
  
      // Prepare email content
      const subject = "Your Password Reset Code";
      const text = `Hello,\n\nYour password reset code is: ${resetCode}\n\nIf you did not request a password reset, please ignore this email. \n\nclick on this link to reset your password and fill in the reset code. http:localhost:3000/reset-password`;
  
      // Send the email using the reusable function
      await sendEmail(email, subject, text);
  
      res.status(200).json({ message: "Reset code sent to email." });
    } catch (error) {
      console.error("Error sending reset code:", error);
      res.status(500).json({ message: "Error sending reset code." });
    }
  };

  /**
 * Get the authenticated user's profile.
 */
const getUserProfile = async (req, res) => {
  try {
    // `req.user` is populated by the authentication middleware
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile." });
  }
};

module.exports = { updateUserProfile, resetPassword, sendResetCode, getUserProfile };

const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer.
 *
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text content of the email.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // Use any other service like Yahoo, Outlook, etc., if needed
      auth: {
        user: process.env.EMAIL_USER, // Sender email address from .env
        pass: process.env.EMAIL_PASS, // Sender email password or app password
      },
    });

    // Define email options
    const mailOptions = {
      from: `"Academic Assistant" <${process.env.EMAIL_USER}>`, // Sender's name and address
      to, // Recipient's email address
      subject, // Subject of the email
      text, // Plain text content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendEmail;

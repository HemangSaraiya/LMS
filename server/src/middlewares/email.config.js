const nodemailer = require("nodemailer");

// Create a transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.BREVO_LOGIN,   // your Brevo account email
    pass: process.env.BREVO_SMTP_KEY, // SMTP key from Brevo dashboard
  },
});

module.exports = transporter;
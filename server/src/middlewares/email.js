const brevo = require('./email.config')

async function VerificationEmail(email, verificationCode) {
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Verify Your Email",
            sender: { name: "L M S", email: "hemangsaraiya249@gmail.com" },
            to: [{ email: email }],
            htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="color: #555; font-size: 16px;">
        Thank you for signing up! Use the verification code below to continue:
      </p>
      <div style="margin: 20px 0;">
        <span style="display: inline-block; padding: 12px 25px; font-size: 24px; letter-spacing: 5px; background-color: #4CAF50; color: white; border-radius: 8px; font-weight: bold;">
          ${verificationCode}
        </span>
      </div>
      <p style="color: #777; font-size: 14px;">This code will expire in 10 minutes.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #aaa; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  </div>
`,
        });
    }
    catch (e) {
        console.log("VerificationEmail error:", e)
    }
}

async function welcomeEmail(email, username) {
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: "hello",
            sender: { name: "L M S", email: "hemangsaraiya249@gmail.com" },
            to: [{ email: email }],
            htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      <h2 style="color: #333;">Welcome to LMS 🎉</h2>
      <p style="color: #555; font-size: 16px;">Hello <b>${username}</b> 👋,</p>
      <p style="color: #555; font-size: 16px;">We're excited to have you join our learning platform.</p>
      <p style="color: #555; font-size: 16px;">Start exploring courses, build new skills, and grow your knowledge step by step.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #aaa; font-size: 12px;">— LMS Team <br/>Built by Hemang Saraiya 🚀</p>
    </div>
  </div>
`,
        });
    }
    catch (e) {
        console.log("welcomeEmail error:", e)
    }
}

module.exports = { VerificationEmail, welcomeEmail }
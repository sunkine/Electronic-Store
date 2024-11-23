import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: { name: "Reset password", address: process.env.GMAIL_USER },
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any other email provider
    auth: {
      user: process.env.GMAIL_USER, // your email user
      pass: process.env.GMAIL_PASS, // your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Activation",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #555;">Welcome to Our Service!</h2>
        <p>Thank you for signing up. Please confirm your email address to activate your account.</p>
        <p>
          Click <a href="${verificationLink}" style="color: #1a73e8; text-decoration: none;">here</a> to activate your account.
        </p>
        <p>If the above link doesn't work, please copy and paste the following URL into your browser:</p>
        <p style="word-wrap: break-word; color: #1a73e8;">${verificationLink}</p>
        <hr style="border: 0; height: 1px; background: #ccc;">
        <p style="font-size: 0.9em; color: #666;">If you didn’t request this email, please ignore it.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default { sendEmail, sendVerificationEmail };

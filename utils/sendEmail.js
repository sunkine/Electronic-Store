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
    service: 'Gmail', // or any other email provider
    auth: {
      user: process.env.GMAIL_USER, // your email user
      pass: process.env.GMAIL_PASS, // your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Activation',
    text: `Please click the link to activate your account: ${verificationLink}`,
    html: `<p>Please click the link below to activate your account:</p><a href="${verificationLink}">${verificationLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
}

export default { sendEmail, sendVerificationEmail};

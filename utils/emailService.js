const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendVerificationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/verify-email/?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Verify your Email",
    text: `Click this link to verify: ${url} `,
  });
};

exports.sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    text: `Click this link to reset your password: ${url}`,
  });
};

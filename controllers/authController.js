const { successResponse, errorResponse } = require("../utils/responseHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/emailService");
const {
  generateToken,
  generateResetToken,
  verifyToken,
  verifyResetToken,
} = require("../utils/tokenService");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const checkUserEmailSimple = await User.findOne({
    where: { [Op.and]: [{ Email: email }, { loginType: "google" }] },
  });
  if (checkUserEmailSimple)
    return errorResponse(
      res,
      "This email is associated with a Google account. Please try logging in using the Google Sign-In option.",
      null,
      200
    );
  let ExistingUser = await User.findOne({ where: { Email: email } });
  if (ExistingUser)
    return errorResponse(res, "User already exists", "Duplicate Email", 200);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PasswordHash: hash,
      PasswordSalt: salt,
      DateLastUpdated: new Date(),
      loginType: "native",
      AuthToken: null,
    });
    const token = await generateToken(user.Email);
    await sendVerificationEmail(user.Email, token);
    successResponse(res, "User registered, check email for verification");
  } catch (err) {
    errorResponse(res, err.message, err, 500);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const email = await verifyToken(token);
    await User.update(
      { Verified: true, DateLastUpdated: new Date() },
      { where: { Email: email } }
    );
    successResponse(res, "Email verified successfully");
  } catch (error) {
    errorResponse(res, "Invalid or expired token", err, 400);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const checkUserEmailSimple = await User.findOne({
    where: { [Op.and]: [{ Email: email }, { loginType: "google" }] },
  });
  if (checkUserEmailSimple)
    return errorResponse(
      res,
      "This email is associated with a Google account. Please try logging in using the Google Sign-In option.",
      null,
      401
    );
  const user = await User.findOne({ where: { Email: email } });
  if (!user) return errorResponse(res, "User doesn't exist.", null, 401);

  if (!user.Verified)
    return errorResponse(res, "Please verify your email first.", null, 401);

  if (!(await bcrypt.compare(password, user.PasswordHash)))
    return errorResponse(res, "Invalid credentials", null, 401);
  await User.update({ DateLastLogin: new Date() }, { where: { Email: email } });
  const accessToken = await generateToken(user.Email);
  successResponse(res, "login successfull!!", { accessToken }, user.UserId);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { Email: email } });
  if (!user) return errorResponse(res, "User not found", null, 404);
  const token = await generateResetToken(user.Email);
  await sendResetPasswordEmail(email, token);
  successResponse(res, "Reset link sent");
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const email = await verifyResetToken(token);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    await User.update(
      { PasswordHash: hash, PasswordSalt: salt, DateLastUpdated: new Date() },
      { where: { Email: email } }
    );
    successResponse(res, "Password reset successfully");
  } catch (error) {
    errorResponse(res, "Invalid or expired token", error, 400);
  }
};

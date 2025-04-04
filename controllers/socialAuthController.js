const { successResponse, errorResponse } = require("../utils/responseHelper");
const User = require("../models/user");

const { generateToken } = require("../utils/tokenService");
const { Op } = require("sequelize");

exports.GoogleSignIn = async (req, res) => {
  const { firstName, email, authToken } = req.body;
  const checkUserEmailSimple = await User.findOne({
    where: { [Op.and]: [{ Email: email }, { loginType: "native" }] },
  });
  const accessToken = await generateToken(email);
  if (checkUserEmailSimple) {
    return successResponse(res, "login successfully!!", { accessToken }, 2);
  } else {
    let ExistingUser = await User.findOne({
      where: { [Op.and]: [{ Email: email }, { AuthToken: authToken }] },
    });
    if (!ExistingUser) {
      try {
        const user = await User.create({
          FirstName: firstName,
          LastName: firstName,
          Email: email,
          PasswordHash: null,
          PasswordSalt: null,
          Verified: true,
          DateLastUpdated: new Date(),
          loginType: "google",
          AuthToken: authToken,
        });
      } catch (err) {
        errorResponse(res, err.message, err, 500);
      }
    }
    successResponse(res, "login successfully!!", { accessToken }, 2);
  }
};
let jwt = require("jsonwebtoken");
let crypto = require("crypto");
let { Op } = require("sequelize");

let sequelize = require("../db/connection");
let genToken = require("../utils/generateToken");
let Email = require("../utils/Email");

let signupUser = async (req, res, next) => {
  try {
    let newUser = await sequelize.models.user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    newUser.password = undefined;
    newUser.passwordConfirm = undefined;
    //here we generate token
    let token = genToken(signupUser.id);
    res.send({ user: newUser, token });
  } catch (error) {
    next(error);
  }
};

let login = async (req, res, next) => {
  try {
    let user = await sequelize.models.user.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      let err = new Error("invalid email or password");
      err.statusCode = 400;
      err.status = "failed";
      return next(err);
    }
    //let compare password with instance method
    let isMatch = await user.isPasswordsMatch(req.body.password);
    if (!isMatch) {
      let err = new Error("invalid email or password");
      err.statusCode = 400;
      err.status = "failed";
      return next(err);
    }
    //here we generate a jwt token
    let token = genToken(user.id);
    res.send({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};

let protectedRoute = async (req, res, next) => {
  try {
    let token;
    //we need to define the token this way because it may come in headers or cookie
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer")
    ) {
      token = req.headers["authorization"].split(" ")[1];
    }
    if (token) {
      try {
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let user = await sequelize.models.user.findByPk(data.userId);
        if (!user) {
          let err = new Error(
            "There is no user related to this token please login again"
          );
          err.statusCode = 400;
          err.status = "failed";
          return next(err);
        }
        //lets check if user recently changed the password after this token has been initialized
        if (user.isPasswordRecentlyChanged(data.iat)) {
          let err = new Error(
            "password is recently changed please login again"
          );
          err.statusCode = 422;
          err.status = "failed";
          return next(err);
        }
        req.user = user;
        next();
      } catch (error) {
        let err = new Error("This token is invalid");
        err.statusCode = 400;
        err.status = "failed";
        return next(err);
      }
    } else {
      let error = new Error("You are not logged in please login to get access");
      error.statusCode = 400;
      error.status = "failed";
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

let restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      let error = new Error("you do not have permission on this route");
      error.statusCode = 400;
      error.status = "failed";
      next(error);
    }
  };
};
//forgot password route
let forgotPassword = async (req, res, next) => {
  try {
    let user = await sequelize.models.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      let error = new Error("there is no user related to this email");
      error.statusCode = 400;
      error.status = "failed";
      return next(error);
    }
    //here we create the token for reset password
    let token = await user.generateResetPasswordToken();
    let url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${token}`;
    let message = `Make a path request with the password and password confirm to
    this URL = ${url}
    `;
    let email = new Email(user.email, "forgot password", message);
    try {
      email.sendEmail();
      await res.send({
        status: "success",
        msg: "an email send to your email ",
      });
    } catch (error) {
      await user.update({
        passwordResetToken: null,
        passwordResetExpire: null,
      });
      let err = new Error("something went wrong");
      err.statusCode = 500;
      err.status = "failed";
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
//reset password
let resetPassword = async (req, res, next) => {
  try {
    //here we need to hash the token and find user by that and check the token is valid because of 10 min expire
    let hash = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    let user = await sequelize.models.user.findOne({
      where: {
        passwordResetToken: hash,
        passwordResetExpire: {
          [Op.gte]: new Date(),
        },
      },
    });
    if (!user) {
      let error = new Error("invalid token");
      error.statusCode = 422;
      error.status = "failed";
      return next(error);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpire = null;
    user.passwordResetToken = null;
    user.passwordChangedAt = new Date();
    await user.save();
    //here we need to log the user in
    let token = genToken(user.id);
    res.status(200).send({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};

//logged in user want to change the password
let updatePassword = async (req, res, next) => {
  try {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let newPasswordConfirm = req.body.newPasswordConfirm;

    //1- first we need to check to see if oldPassword matches the logged in user password
    let isPasswordsMatch = await req.user.isPasswordsMatch(oldPassword);
    if (!isPasswordsMatch) {
      let error = new Error("password is wrong");
      error.statusCode = 400;
      error.status = "failed";
      return next(error);
    }
    await req.user.update({
      password: newPassword,
      passwordConfirm: newPasswordConfirm,
    });
    //here we need to log user again
    let token = genToken(user);
    res.send({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  signupUser,
  login,
  protectedRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};

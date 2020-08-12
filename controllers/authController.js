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
      return res.status(400).send({
        status: "failed",
        msg: "invalid email or password",
      });
    }
    //let compare password with instance method
    let isMatch = await user.isPasswordsMatch(req.body.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "failed",
        msg: "invalid email or password",
      });
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
          return next(
            new Error(
              "There is no user related to this token please login again"
            )
          );
        }
        //lets check if user recently changed the password after this token has been initialized
        if (user.isPasswordRecentlyChanged(data.iat)) {
          return next(
            new Error("password is recently changed please login again")
          );
        }
        req.user = user;
        next();
      } catch (error) {
        let err = new Error("This token is invalid");
        return next(err);
      }
    } else {
      let error = new Error("You are not logged in please login to get access");
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
      next(new Error("you do not have permission on this route"));
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
      return res.status(400).send({
        status: "failed",
        msg: "there is no user related to this email",
      });
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
      return res.status(500).send({
        status: "failed",
        msg: "some thing went wrong",
      });
    }
  } catch (error) {
    next(error);
  }
};

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
      return res.status(400).send({
        status: "failed",
        msg: "invalid token",
      });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpire = null;
    user.passwordResetToken = null;
    user.passwordChangedAt = new Date();
    await user.save();
    res.send(user);
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
};

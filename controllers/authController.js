let sequelize = require("../db/connection");

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
    res.send(newUser);
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
    //here we need to generate the token
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupUser,
  login,
};

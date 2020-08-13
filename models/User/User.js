let bcrypt = require("bcryptjs");
let { Model, DataTypes } = require("sequelize");
let crypto = require("crypto");
let sequelize = require("../../db/connection");

class User extends Model {
  //instance method for
  async isPasswordsMatch(rawPassword) {
    let hashPass = this.getDataValue("password");
    return await bcrypt.compare(rawPassword, hashPass);
  }
  isPasswordRecentlyChanged(tokenInitDate) {
    let passwordChangedAt = this.getDataValue("passwordChangedAt");
    if (passwordChangedAt) {
      let dateToken = new Date(passwordChangedAt);

      return dateToken.getTime() / 1000 > tokenInitDate;
    } else {
      return false;
    }
  }
  async generateResetPasswordToken() {
    //we need to hash some thing and that thing is some random bytes
    let token = crypto.randomBytes(32).toString("hex");
    let hash = crypto.createHash("sha256").update(token).digest("hex");
    //here we need to save the token in db
    this.setDataValue("passwordResetToken", hash);
    this.setDataValue(
      "passwordResetExpire",
      new Date(Date.now() + 10 * 60 * 1000)
    );
    await this.save({ validate: false });
    return token;
  }
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: "name can not be empty string" },
        notNull: { args: true, msg: "name is a required field" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { args: true, msg: "email can not be empty string" },
        notNull: { args: true, msg: "email is a required field" },
        isEmail: { args: true, msg: "this is not a valid email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: "password can not be empty string" },
        notNull: { args: true, msg: "password is a required field" },
        min: {
          args: [8],
          msg: "password must be at least 8 character long",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "passwordConfirm can not be empty string" },
        isMatchWith(value) {
          if (value !== this.password) {
            throw new Error("Password and passwordConfirm not match");
          }
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: {
          args: ["user", "admin", "guide", "lead-guide"],
        },
      },
    },
    passwordResetToken: { type: DataTypes.STRING },
    passwordResetExpire: { type: DataTypes.DATE },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "user",
    hooks: {
      //here we go for hash passwords
      async beforeSave(user) {
        let hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        user.passwordConfirm = null;
      },
    },
  }
);

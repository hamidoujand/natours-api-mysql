let { Model, DataTypes } = require("sequelize");
let sequelize = require("../../db/connection");
let bcrypt = require("bcryptjs");

class User extends Model {
  //instance method for
  async isPasswordsMatch(rawPassword) {
    let hashPass = this.getDataValue("password");
    return await bcrypt.compare(rawPassword, hashPass);
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
    validate: {
      isPasswordsMatch() {
        if (this.password !== this.passwordConfirm) {
          throw new Error("password and passwordConfirm are not match");
        }
      },
    },
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

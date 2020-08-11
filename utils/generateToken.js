let jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign(
    {
      userId: 1,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

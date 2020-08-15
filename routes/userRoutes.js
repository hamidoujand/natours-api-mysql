let router = require("express").Router();
let authController = require("../controllers/authController");

//POST signup user
router.post("/signup", authController.signupUser);

//POST login
router.post("/login", authController.login);

//POST get
router.post("/forgot-password", authController.forgotPassword);

//PATCH update user password
router.patch(
  "/update-password",
  authController.protectedRoute,
  authController.updatePassword
);

//PATCH reset password
router.patch("/reset-password/:resetToken", authController.resetPassword);

module.exports = router;

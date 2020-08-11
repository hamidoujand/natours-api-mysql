let router = require("express").Router();
let authController = require("../controllers/authController");

//POST signup user
router.post("/signup", authController.signupUser);

//POST login
router.post("/login", authController.login);

//POST get
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;

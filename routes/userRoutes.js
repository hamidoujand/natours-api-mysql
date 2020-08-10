let router = require("express").Router();
let authController = require("../controllers/authController");

//POST signup user
router.post("/signup", authController.signupUser);

//POST login
router.post("/login", authController.login);

module.exports = router;

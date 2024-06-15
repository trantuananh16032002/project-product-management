// user
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const validate = require("../../validate/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware")

router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgot);
router.post("/password/forgot", validate.forgotPost, controller.forgotPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);
router.get("/info",authMiddleware.requiredAuth, controller.info);

module.exports = router;

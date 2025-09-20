const express = require("express");
const {
  Signup,
  Login,
  Logout,
  signupFile,
  Loginfile,
  homefile
} = require("../Controller/UserController");
const authenticate = require("../Middleware/auth");

const UserRouter = express.Router();

UserRouter.post("/signup", Signup);
UserRouter.get("/signUP", signupFile);

UserRouter.post("/login", Login);
UserRouter.get("/login", Loginfile);

UserRouter.get("/home", authenticate, homefile);
UserRouter.get("/logout",authenticate, Logout);

module.exports = UserRouter;

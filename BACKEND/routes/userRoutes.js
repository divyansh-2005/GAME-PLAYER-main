const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/userController");

Router.post("/user/save", UserController.saveUser);
Router.get("/user/fetch", UserController.fetchUser);
Router.post("/user/update-points", UserController.updatePoints);

module.exports = Router;
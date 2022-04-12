var express = require("express");
var router = express.Router();

var authenticationRouter = require("./authentication");

var users_list_controller = require("../controllers/user/usersListController");
var user_instance_controller = require("../controllers/user/userInstanceController");

router.get("/users", users_list_controller.users_list_get);
router.post("/users", users_list_controller.users_list_post);

router.get("/users/:id", user_instance_controller.user_instance_get);

router.use("/authentication", authenticationRouter);

module.exports = router;

var express = require("express");
var router = express.Router();

var passport = require("passport");

var authenticationRouter = require("./authentication");

var users_list_controller = require("../controllers/user/usersListController");
var user_instance_controller = require("../controllers/user/userInstanceController");

var unAuthenticatedChecker =
	require("../controllers/helpers/middlewares/unAuthenticatedChecker").checkUnAuthenticated;
var isOwnedByUserChecker =
	require("../controllers/helpers/middlewares/isOwnedByUserChecker").checkIsOwnedByUser;

router.get("/users", users_list_controller.users_list_get);
router.post(
	"/users",
	unAuthenticatedChecker,
	users_list_controller.users_list_post
);

router.get("/users/:id", user_instance_controller.user_instance_get);

router.get(
	"/users/:id/messages",
	user_instance_controller.user_instance_messages_get
);
router.post(
	"/users/:id/messages",
	passport.authenticate("jwt", { session: false }),
	isOwnedByUserChecker,
	user_instance_controller.user_instance_messages_post
);

router.use("/authentication", authenticationRouter);

module.exports = router;

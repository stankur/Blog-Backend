var express = require("express");
var router = express.Router();

var authenticationController = require("../controllers/authenticationController");

router.post("/login", authenticationController.login_post);

module.exports = router;

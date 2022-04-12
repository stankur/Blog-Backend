require("dotenv").config();

var passport = require("passport");
var bcrypt = require("bcryptjs");
var jsonWebToken = require("jsonwebtoken");

var User = require("../models/user");

var errroSender = require("./helpers/errorSender");

exports.login_post = (req, res, next) => {
	User.findOne({ username: req.body.username })
		.then((user) => {
			if (!user) {
				return errroSender.generateErrorResponseJson(
					res,
					"could not find user with the given username"
				);
			}

			bcrypt
				.compare(req.body.password, user.password)
				.then((passwordValid) => {
					if (passwordValid) {
						var jwtPayload = {
							id: user._id,
							iat: Date.now(),
						};

						var signedToken = jsonWebToken.sign(
							jwtPayload,
							process.env.SECRET
						);

						return res.json({ token: signedToken });
					}
					return errroSender.generateErrorResponseJson(
						res,
						"wrong password"
					);
				});
		})
		.catch((err) => {
			next(err);
		});
};

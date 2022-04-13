var errorSender = require("../errorSender");

var passport = require("passport");

exports.checkUnAuthenticated = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, user) => {
		if (err) {
			return next(err);
		}

		if (user) {
			return errorSender.generateErrorResponseJson(
				res,
				"you already have an account. You could only login once"
			);
		} else {
			return next();
		}
	})(req, res, next);
};

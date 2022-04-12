require("dotenv").config();

var User = require("../../models/user");

exports.user_instance_get = (req, res, next) => {
	var requestedUserID = req.params.id;

	User.findById(requestedUserID, (err, user) => {
		if (err) {
			next(err);
		}

		res.json(user);
	});
};

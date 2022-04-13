var errorSender = require("../errorSender");

exports.checkIsOwnedByUser = (req, res, next) => {
	if (req.params.id === req.user._id.toString()) {
		next();
	} else {
		return errorSender.generateErrorResponseJson(
			res,
			"you are not the owner of the account so you may not add messages"
		);
	}
};

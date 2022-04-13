require("dotenv").config();

var User = require("../../models/user");
var Message = require("../../models/message");

var errorSender = require("../helpers/errorSender");
const { request } = require("../../app");

var getUserDataWithoutPassword = (userId, userSearchResultCallback) => {
	User.findById(userId, { password: 0 }, userSearchResultCallback);
};

exports.user_instance_get = (req, res, next) => {
	var requestedUserID = req.params.id;

	var userSearchResultCallback = (err, user) => {
		if (err) {
			return next(err);
		}

		return res.json(user);
	};

	getUserDataWithoutPassword(requestedUserID, userSearchResultCallback);
};

exports.user_instance_messages_get = (req, res, next) => {
	var requestedUserID = req.params.id;

	var userSearchResultCallback = (err, user) => {
		if (err) {
			return next(err);
		}

		if (user) {
			return res.json(user.messages);
		} else {
			return errorSender.generateErrorResponseJson(
				res,
				"no user with given user id found"
			);
		}
	};

	getUserDataWithoutPassword(requestedUserID, userSearchResultCallback);
};

exports.user_instance_messages_post = (req, res, next) => {
	var requestedUserID = req.params.id;

	var newMessage = new Message({
		user: requestedUserID,
		date: Date.now(),

		text: req.body.message,

		replies: [],
	});

	var addNewMessageToCreator = (err) => {
		if (err) {
			return next(err);
		}

		var newMessageId = newMessage._doc._id;

		var sendJsonResponse = (err, user) => {
			if (err) {
				return next(err);
			}

			if (user) {
				return res.json({ user });
			} else {
				return errorSender.generateErrorResponseJson(
					res,
					"could not find user with the given id"
				);
			}
		};

		User.findByIdAndUpdate(
			requestedUserID,
			{
				$push: { messages: newMessageId },
			},
			sendJsonResponse
		);
	};

	newMessage.save(addNewMessageToCreator);
};

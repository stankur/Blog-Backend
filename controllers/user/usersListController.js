require("dotenv").config();

var User = require("../../models/user");
var async = require("async");

var errorSender = require("../helpers/errorSender");

var bcrypt = require("bcryptjs");
var passport = require("passport");

var linkGenerator = require("../helpers/linkGenerator");

exports.users_list_get = (req, res, next) => {
	async.parallel(
		{
			users_count: function (callback) {
				User.countDocuments({}, callback);
			},
			users: function (callback) {
				User.find({}, callback);
			},
		},
		(error, results) => {
			if (error) {
				next(error);
			}

			var userRelGenerator = (user) => {
				return "user_" + user._id;
			};

			var userHrefGenerator = (user) => {
				return process.env.BASE_URL + "/api/users/" + user._id;
			};

			var userActionGenerator = () => {
				return "GET";
			};

			var userTypesGenerator = () => {
				return ["application/json"];
			};

			var userLinks = linkGenerator.generateMultipleLinks(
				results.users,
				userRelGenerator,
				userHrefGenerator,
				userActionGenerator,
				userTypesGenerator
			);

			var selfLink = linkGenerator.generateSingleLink(
				"self",
				process.env.BASE_URL + "/api/users",
				"GET",
				["application/json"]
			);

			var usersInfo = results;
			var completeLinks = [selfLink, ...userLinks];

			var responseJson = {
				...usersInfo,
				links: completeLinks,
			};

			res.json(responseJson);
		}
	);
};

exports.users_list_post = (req, res, next) => {
	var saveUser = (err, hashedPassword) => {
		if (err) {
			next(err);
		}

		var newUser = new User({
			username: req.body.username,
			password: hashedPassword,

			creationDate: Date.now(),

			messages: [],
			replies: [],
		});

		newUser.save((err) => {
			if (err) {
				next(err);
			}

			var selfLink = linkGenerator.generateSingleLink(
				"self",
				process.env.BASE_URL + "/api/users",
				"GET",
				["application/json"]
			);

			var authenticationLink = linkGenerator.generateSingleLink(
				"authentication",
				process.env.BASE_URL + "/api/authentication",
				"POST",
				["application/json"]
			);

			var usersInfo = newUser._doc;
			var completeLinks = [selfLink, authenticationLink];

			var responseJson = {
				...usersInfo,
				links: completeLinks,
			};

			res.json(responseJson);
		});
	};

	User.find({ username: req.body.username }, (err, foundUsers) => {
		if (err) {
			next(err);
		}

		if (foundUsers.length > 0) {
			errorSender.generateErrorResponseJson(res, "username is used");
		} else {
			bcrypt.hash(req.body.password, 10, saveUser);
		}
	});
};

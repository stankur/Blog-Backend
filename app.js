require("dotenv").config();

var createError = require("http-errors");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var cors = require("cors");

var passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var User = require("./models/user");

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");

var app = express();

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET,
		},
		(jwtPayload, done) => {
			User.findOne({ _id: jwtPayload.id }, (err, user) => {
				if (err) {
					return done(err, false);
				}

				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}
	)
);
app.use(passport.initialize());

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = app;

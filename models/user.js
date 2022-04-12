var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },

	creationDate: { type: Date, default: Date.now() },

	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

module.exports = mongoose.model("User", UserSchema);

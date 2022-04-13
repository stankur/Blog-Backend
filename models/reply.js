var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReplySchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date, default: Date.now() },

	text: { type: String, required: true },

	nestedLevel: { type: Number, required: true },

	message: { type: Schema.Types.ObjectId, ref: "Message", required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

module.exports = mongoose.model("Reply", ReplySchema);

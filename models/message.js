var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date, default: Date.now() },

	text: { type: String, required: true },

	replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

module.exports = mongoose.model("Message", MessageSchema);

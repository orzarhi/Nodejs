const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		idTeuda: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
			required: true,
		},
		address: {
			type: String,
			trim: true,
			required: true,
		},
		paymentType: {
			type: String,
			trim: true,
			required: true,
			enum: ["cheque", "creditCard"],
		},
		isAdmin: {
			type: Boolean,
			trim: true,
			default: false,
		},
		productList: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model("users", userSchema);
module.exports = User;

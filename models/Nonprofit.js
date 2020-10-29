const mongoose = require('mongoose');
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

const NonprofitSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	slug: String,
	email: {
		type: String,
		required: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please use a valid URL with HTTP or HTTPS',
		],
	},
	guideStarAddress: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please use a valid URL with HTTP or HTTPS',
		],
	},
	phone: {
		type: String,
		maxlength: [20, 'Phone number can not be longer than 20 characters'],
	},
	ein: {
		type: String,
		required: [true, 'Please enter a valid EIN number'],
	},
	fiscalSponsor: {
		type: String,
		maxlength: 200,
	},
	address: {
		type: String,
		required: true,
	},
	location: {
		// GeoJSON Point
		type: {
			type: String,
			enum: ['Point'],
		},
		coordinates: {
			type: [Number],
			//required: true,
			index: '2dsphere',
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String,
	},
	photo: {
		type: String,
		default: 'no-photo.jpg',
	},
	description: {
		type: String,
		//required: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		//required: true,
	},
});

//@TODO - Configure Phone numbers
// Nonprofit.plugin(mongooseIntlPhoneNumber, {
// 	hook: 'validate',
// 	phoneNumberField: 'phone',
// 	nationalFormatField: 'nationalFormat',
// 	internationalFormatField: 'internationalFormat',
// 	countryCodeField: 'countryCode',
// });

module.exports = mongoose.model('Nonprofit', NonprofitSchema);

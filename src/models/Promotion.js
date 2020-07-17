const mongoose = require('mongoose')

const promotionSchema = mongoose.Schema ({
	name: {
		type: String
	},
	duration: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String
	},
	fee: {
		type: Number
	},
	keywords: [{
		type: String
	}],
})

const Promotion = mongoose.model('Promotion', promotionSchema)

module.exports = Promotion
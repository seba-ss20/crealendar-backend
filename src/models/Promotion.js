const mongoose = require('mongoose')

const promotionSchema = mongoose.Schema ({
	name: {
		type: String
	},
	duration: {
		type: Number,
		required: true
	},
	dateStart: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		required: false
	},
	owner:{
		type: String,
		required: false,
	},
	description: {
		type: String
	},
	price: {
		type: Number
	},
	tags: [{
		data: String,
		key: Number
	}], // TODO :: Make it an array of numbers from Categories table.
	// owner: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// 	unique: true
	// } // TODO:: Uncomment this part after fixing it.
	//createdAt: {
	//	type: Date,
	//	default: Date.now
	//},
}, {timestamps: true})

promotionSchema.index({createdAt: 1},{expireAfterSeconds: 86400*promotionSchema.duration});

const Promotion = mongoose.model('Promotion', promotionSchema)

module.exports = Promotion
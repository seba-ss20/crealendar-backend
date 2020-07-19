const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const eventSchema = mongoose.Schema ({

	name: {
		type: String,
		required: true,
	},

	dateStart: {
		type: Date,
		required: true,
	},

	dateEnd: {
		type: Date,
		required: false,
	},

	location: String,
	recurrence: {
		freq:String,
		byDay: [String]
	},
	description: String,
	price: Number,
	capacity: Number,
	numberOfParticipants: Number,
	image : String,

	status: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		required: false
	},
	tags: [{
		data: String,
		key: Number
	}], // TODO :: Make it an array of numbers from Categories table.
	participants : [String],
	// owner: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// 	unique: true
	// } // TODO:: Uncomment this part after fixing it.
	owner:{
		type: String,
		required: false
	}
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
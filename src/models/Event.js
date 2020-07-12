const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const eventSchema = mongoose.Schema ({
	eventID: {
		type: String,
		required: true,
		unique: true
	},

	name: {
		type: String,
		required: true,
	},

	dateStart: {
		type: String,
		required: true,
	},

	dateEnd: {
		type: String,
		required: true,
	},


	location: String,
	recurrence: {
		freq:String,
		byDay: [String]
	},
	description: String,

	capacity: Number,
	numberOfParticipants: Number,

	status: {
		type: String,
		required: true,
	},
	source: {
		type: String,
		required: true
	},
	categories: [String], // TODO :: Make it an array of numbers from Categories table.

	// owner: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// 	unique: true
	// } // TODO:: Uncomment this part after fixing it.
	owner:{
		type: String,
		required: true,
	}
});

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
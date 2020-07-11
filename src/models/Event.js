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
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
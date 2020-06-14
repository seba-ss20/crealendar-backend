const mongoose = require('mongoose')

const eventSchema = mongoose.Schema ({
	eventID: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		required: true,
		unique: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
		required: true,
		unique: true
	}
})

const Event = mongoose.model('Event', caseSchema)

module.exports = Event
const express = require('express');

const Event  = require('../models/Event');
const router = express.Router();

// upload an event
router.post('/events', async (req, res) => {
		const { eventID, name, date, owner, subtitle, description, keywords, capacity } = req.body
		try {
			var event = new Event({ eventID, name, date, owner, subtitle, description, keywords, capacity })
			await event.save()
			res.status(201).send({ message: "Event created successfully" })
		} catch(error) {
			res.status(500).end()
		}
	}
)

// get an event by its unique id
router.get('/events', async (req, res) => {
		try {			
			let _id = req.query._id
			var event = await Event.findOne({_id: _id}) // check if an event with this eventID exists
			if (!event) {
				res.status(400).send({ error: "No event with this id"})
				return
			}
			res.status(200).send(event)
		} catch(error) {
			res.status(500).end()
		}
	}
)

module.exports = router
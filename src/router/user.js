const express = require('express');

const Event  = require('../models/Event');
const router = express.Router();
const User  = require('../models/UserProfile');

router.get('/users', async (req, res) => {
	try {
		let username = req.query.username
		const users = await User.find({username: username})
		if (!users) {
            res.status(400).send({ error: "No users with this username" })
            return
        }
		res.send(users)
	} catch(error) {
		console.log(error)
		res.status(500).end()
	}
})

router.get('/users/all', async (req, res) => {
	try {
		let word = req.query.username
		if (word.length === 0) {
			const user = ''
			res.send(user)
			//res.status(400).send({ error: "Query is empty" })
			return
		}
		const users = await User.find({username: new RegExp(word, 'i')})
		if (!users) {
            res.status(400).send({ error: "No users in the database" })
            return
        }
		const result = users.map((user) => {return {"username": user.username, "chatID": user.chatID}})
		console.log(result)
		res.send(users)
	} catch(error) {
		console.log(error)
		res.status(500).end()
	}
})

router.get('/users/user_info', async (req, res) => {
    try {
        const _id = req.query._id;
		const user = await User.findOne({_id: _id})
		if (!user) {
			res.status(400).send({ error: "No user with this id"})
			return
		}
        res.send({ "username": user.username, "mobile": user.mobile, "chatID": user.chatID})
    } catch (error) {
        res.status(500).end()
    }
})

module.exports = router;
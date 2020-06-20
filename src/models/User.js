const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config     = require('../config');


const userSchema = mongoose.Schema({
	// we use email adresses as usernames
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    const token = jwt.sign({id: user._id, username: user.username}, config.JwtSecret, { expiresIn: "30d" })
    user.tokens = user.tokens.concat({ token })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
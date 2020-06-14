const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
    next()
})

// Generate an auth token for the user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "30d" })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User
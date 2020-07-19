const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userProfileSchema = mongoose.Schema({
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
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    calendar :{
        uploaded: Boolean,
        uploadDate: String,
    },
	mobile: {
		type: Number
	},
	chatID: {
		type: Number
	},

    tags : [String],
    showNearMe: Boolean,
    eventList: [{
        event: {
            type: String,
            required: false
        }
    }]
})

// Hash the password before saving the user model
userProfileSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema)

module.exports = UserProfile;
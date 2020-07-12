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
    role: {
        type: String,
        required: true
    },
    calendar :{
        uploaded: Boolean,
        uploadDate: String,
    },

    tags : [String],
    showNearMe: Boolean,
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
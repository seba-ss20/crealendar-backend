const mongoose = require('mongoose');
const userProfileSchema = require('./UserProfile');

const extend = (Schema, obj) => (
    new mongoose.Schema(
        Object.assign({}, Schema.obj, obj)
    )
);

const userSchema = extend( userProfileSchema,{
    interest: {
        type: String,
        required: false,
    },
    age: {
        type: String,
        required: false
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User


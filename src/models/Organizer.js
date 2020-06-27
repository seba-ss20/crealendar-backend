const mongoose = require('mongoose');
const userProfileSchema = require('./UserProfile');

const extend = (Schema, obj) => (
    new mongoose.Schema(
        Object.assign({}, Schema.obj, obj)
    )
);


const organizerSchema = extend(userProfileSchema, {
    eventList: [{
        event: {
            type: String,
            required: false
        }
    }]
})


const Organizer = mongoose.model('Organizer', organizerSchema)

module.exports = Organizer

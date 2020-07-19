const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const eventTag = mongoose.Schema ({

    name : {
        type: String,
        required: true,
        unique: true,
    },
    added_by : {
        type: String,
        required: true,
    }
});

const EventCategory = mongoose.model('EventTag', eventTag);

module.exports = EventCategory;

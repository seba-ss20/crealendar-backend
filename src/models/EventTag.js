const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const eventTag = mongoose.Schema ({

    id : {
        type :Number,
        required: true
    },
    name : {
        type: String,
        required: true,
        unique: true,
    }
});

const EventCategory = mongoose.model('EventTag', eventTag);

module.exports = EventCategory;

const config     = require('../config');
const EventModel  = require('../models/Event');
const UserProfileModel  = require('../models/UserProfile');
const EventTagModel  = require('../models/EventTag');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TODO:: Tags should have following format : First letter of each word in tag should be upper, rest lower case.
// TODO:: Fix DB errors.

const setTagsOfUser = async (req,res) => {
    // TODO:: Check Tag formatting.
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });

    let username = req.body.username;
    let tags = [];
    req.body.tags.tags.map(tag => {
        tags.push(tag.data);
    });

    try {
        const user = await UserProfileModel.findOneAndUpdate({username:username},
            { $set : { tags: tags}},{new:true});
        return res.status(201).json(user)
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};


const addTagToUser = async (req,res) => {

};
const addTagToEvent = async (req,res) => {

};
const addTagToPool = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'tag')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    let tags = Object.assign({}, req.body.tags);
    let assigned_tags = [];
    try {
        for(let i = 0 ; i < tags.length ; i++) {
            let tag = tags[i];
            let doesTagExist = await EventModel.countDocuments({ name: tag.name }).exec() > 0;
            if(!doesTagExist){
                console.log('Inserting tag '+ i + '' + tag.name);
                let assigned_tag = await EventTagModel.create(tag);
                assigned_tags.push(assigned_tag);
            }
            else{
                console.log('Tag ' + tag.name+ ' already exists.');
            }
        }
        return res.status(200).json(assigned_tags);
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const getTagsOfUser = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.params, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    try {

        let tags = await UserProfileModel.find({username: req.params.username}).select('tags').exec();

        return res.status(200).json(tags);
    } catch(err) {
        console.log(err);

        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const getTagsOfEvent = async (req,res) => {

};

const getAllTags = async (req,res) => {
    try {
        let tags = await EventTagModel.find({}).exec();
        return res.status(200).json(tags);
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const removeTagFromUser = async (req,res) => {


};

const removeTagFromEvent = async (req,res) => {

};


module.exports = {
    addTagToPool,
    setTagsOfUser,
    addTagToUser,
    addTagToEvent,
    getTagsOfUser,
    getTagsOfEvent,
    listTags: getAllTags,
    removeTagFromUser,
    removeTagFromEvent,
};
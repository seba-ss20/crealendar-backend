const config     = require('../config');
const EventModel  = require('../models/Event');
const UserProfileModel  = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');

const deleteCalendar = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });

    let username = req.body.username;
    return res.status(200).json(username);
    // TODO:: Complete
};
const uploadCalendar = async (req,res) => {

    // console.log(res);
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'events')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a events property'
    });

    let events = Object.assign({}, req.body.events).events;
    let username = req.body.username;


    try {
        let user = await EventModel.findOne({username: username}).exec();
        let r_event;

        // console.log(events.events);
        // console.log(events.events.length);

        let r_events = [];
        console.log(events);

        for(let i = 0 ; i < events.length ; i++){

            console.log('Processing Event ' + i);
            events[i]['source'] = 'calendar';
            let doesEventExist = await EventModel.countDocuments({ _id: events[i]._id }).exec() > 0;
            console.log( EventModel.countDocuments({ _id: events[i]._id }).exec());

            if(!doesEventExist){
                console.log('Inserting event '+ i + '' + events[i].name);
                let r_event = await EventModel.create(events[i]);
                r_events.push(r_event)
            }
            else{
                console.log('Updating event '+ i + '' + events[i].name);
                let filter = {_id: events[i]._id};
                let u_event = await EventModel.findOneAndReplace(filter,events[i]);
            }

        }
        let now = new Date();
        console.log('Adding Time for calendar' + new Date(now).toUTCString());
        let user_after = await UserProfileModel.findOneAndUpdate({username:username},{ $set : {calendar:{uploaded: true, uploadDate: new Date(now).toUTCString()}}},{new:true});
        console.log(user_after);

        return res.status(200).json(user_after);
    } catch(err) {
        console.log(err);
        if(err.code === 11000){
            return res.status(500).json({
                error: 'DB Error',
                message: err.message
            });
        }

    }
};
const add = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    try {
        let event = await EventModel.create(req.body);

        return res.status(201).json(event)
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const getImage = async (req,res) => {
    // TODO Check for file:
    let event = await EventModel.findById(req.params.eventId).exec();
    res.sendFile(event.image);
};
const addImage = async (req, res) => {
    try {

        let event_id  = req.body._id;
        let image  = req.file;

        if(!image){
            return res.status(400).send({ message: 'Image not provided!' });
        }

        let path_arr = req.file.originalname.split('.');
        let extension = path_arr[path_arr.length-1];

        const tempPath = req.file.path;
        const dirpath = __dirname + "/../../images/";

        fs.access(dirpath,fs.constants.F_OK,(err)=> {
            if(err){
                console.log(dirpath + ' does not exists. Creating!')
                fs.mkdir(dirpath, { recursive: true },err => {
                    if(err){
                        console.error(err);
                    }
                });
            }
        });

        const targetPath = path.join(dirpath + event_id+"."+extension);
        fs.access(targetPath, fs.constants.F_OK, (err) => {
            if(err){
                console.log(targetPath + ' does not exists. Creating!')
            }
            else{
                console.log(targetPath + ' exists. Deleting!');
                fs.unlink(targetPath, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted '+targetPath);
                });
            }
        });

        fs.rename(tempPath, targetPath, (err) => {
            if (err)
            {
                console.log(err);
                return res.status(500).json({
                    error:'Could not move file',
                    message:err.message
                });
            }
            else{
                console.log("Successfully added image to " +targetPath);
            }
        });
        let event = await EventModel.findByIdAndUpdate(event_id,{image:targetPath} , {
            new: true,
            runValidators: true
        }).exec();

        return res.status(200).json(event);
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const listAll  = async (req, res) => {
    try {
        let events = await EventModel.find({}).exec();
        return res.status(200).json(events);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

// const listEvent = async (req, res) => {
//     try {
//         let event = await EventModel.findById(req.params.eventId).exec();
//         if (!event) return res.status(404).json({
//             error: 'Not Found',
//             message: `Event not found`
//         });
//
//         return res.status(200).json(event)
//     } catch(err) {
//         return res.status(500).json({
//             error: 'Internal Server Error',
//             message: err.message
//         });
//     }
// };
const listEvent = async (req, res) => {
    try {
        let event = await EventModel.findById(req.params.eventId).exec();
        if (!event) return res.status(404).json({
            error: 'Not Found',
            message: `Event not found`
        });

        return res.status(200).json(event)
    } catch(err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
const remove = async (req, res) => {
    try {
        await EventModel.findByIdAndRemove(req.params.event_id).exec();
        return res.status(200).json({message: `Event with id${req.params.id} was deleted`});
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const update = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    try {
        let event = await EventModel.findByIdAndUpdate(req.params.event_id, req.body, {
            new: true,
            runValidators: true
        }).exec();

        return res.status(200).json(event);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const listAllEventByUserId = async (req, res) => {
    try {
        let events = await EventModel.find({owner: req.params.userId}).exec();
        return res.status(200).json(events);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};


module.exports = {
    deleteCalendar,
    uploadCalendar,
    add,
    addImage,
    getImage,
    listAll,
    listEvent,
    listAllEventByUserId,
    update,
    remove
};
const config     = require('../config');
const UserProfileModel  = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');

const login = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a password property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });

    try {
        let user = await UserProfileModel.findOne({username: req.body.username}).exec();
        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            console.log(req.body.password)
            console.log(user.password)
            return res.status(401).send({token: null});
        }

        // if user is found and password is valid
        // create a token
        const token = jwt.sign({id: user._id, username: user.username}, config.JwtSecret, { expiresIn: "30d" });
        return res.status(200).json({token: token, role: user.role, user: user});
    } catch(err) {
        return res.status(404).json({
            error: 'User Not Found',
            message: err.message
        });
    }
};


const register = async (req,res) => {

    if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a password property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'firstname') || !Object.prototype.hasOwnProperty.call(req.body, 'lastname'))
        return res.status(400).json({
        error: 'Bad Requesty',
        message: 'The request body must contain name and surname property'
    });
    const user = Object.assign(req.body, {password: req.body.password});

    if(user.firstname.length > 1)
        user.firstname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    else
        user.firstname = user.firstname.charAt(0).toUpperCase();

    if(user.lastname.length > 1)
        user.lastname = user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    else
        user.lastname = user.lastname.charAt(0).toUpperCase();

    try {

        let retUser = await UserProfileModel.create(user);
        // if user is registered without errors
        // create a token
        const token = jwt.sign({id: user._id, username: user.username, }, config.JwtSecret, { expiresIn: "30d" });

        res.status(200).json({token: token, role: user.role});
    } catch(err) {
        console.log(err);
        if (err.code == 11000) {
            return res.status(400).json({
                error: 'User exists',
                message: err.message
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
};
//TODO:: REMOVE
const getUser = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    let username = req.body.username;
    try {
        const user = await UserProfileModel.findOne({username: username});
        res.status(200).json(user);

    } catch(err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'User exists',
                message: err.message
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }

};
const setShowNearMe = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    if (!Object.prototype.hasOwnProperty.call(req.body, 'near_me')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    let username = req.body.username;
    let near_me = req.body.near_me;
    try {
        const user = await UserProfileModel.findOneAndUpdate({username: username},
            { $set : { showNearMe: near_me}},{new:true});

        res.status(200).json(user);

    } catch(err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'User exists',
                message: err.message
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
};
const getAvatar = async (req,res) => {
    // TODO Check for file:
    let user = await UserProfileModel.findOne({username:req.params.username}).exec();
    console.log(user);
    if(typeof user.avatar !== 'undefined'){
        res.sendFile(user.avatar);
    }
};
const addAvatar = async (req, res) => {
    try {
        console.log('Inside addAvatar');
        let user_id  = req.body._id;
        let image  = req.file;

        if(!image){
            console.log('Where is the image?');
            return res.status(400).send({ message: 'Image not provided!' });
        }

        let path_arr = req.file.originalname.split('.');
        let extension = path_arr[path_arr.length-1];

        const tempPath = req.file.path;
        const dirpath = path.join(__dirname, "/../../avatars/");
        console.log('dirpath');
        console.log(dirpath);
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
        const targetPath = path.join(dirpath + user_id+"."+extension);
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
                console.log("Successfully added avatar to " +targetPath);
            }
        });

        let user = await UserProfileModel.findOneAndUpdate({username:user_id},{ $set : { avatar: targetPath}},{new:true});

        return res.status(200).json(user);
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const addCommunication = async (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body must contain a username property'
    });
    let mobile = req.body.mobile;
    let chatid = req.body.chatid;

    try{
        let user = await UserProfileModel.findOneAndUpdate({username:req.body.username},{ $set : { mobile: mobile,chatID:chatid}},{new:true}).exec();
        console.log(user);
        res.status(200).json(user);
    }
    catch (e) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });

    }

};
const logout = (req, res) => {
    res.status(200).send({ token: null });
};


module.exports = {
    login,
    register,
    addCommunication,
    logout,
    setShowNearMe,
    addAvatar,
    getAvatar,
    getUser //TODO:: REMOVE
};
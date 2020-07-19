const config     = require('../config');
const UserProfileModel  = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


const logout = (req, res) => {
    res.status(200).send({ token: null });
};


module.exports = {
    login,
    register,
    logout,
    setShowNearMe,
    getUser //TODO:: REMOVE
};
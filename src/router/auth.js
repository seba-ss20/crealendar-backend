"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middleware');
const AuthController = require('../controllers/auth');


router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/getUser', AuthController.getUser);
router.post('/nearme', AuthController.setShowNearMe);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);

module.exports = router;
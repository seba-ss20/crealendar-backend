const express = require('express');
const router = express.Router();
const multer = require( 'multer');

const middlewares = require('../middleware');
const AuthController = require('../controllers/auth');

const upload = multer({
    dest: __dirname+"/../../tmpImages"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

router.post('/login', AuthController.login);
router.post('/uploadAvatar', upload.single("avatar"),AuthController.addAvatar);
router.post('/register', AuthController.register);
router.post('/getUser', AuthController.getUser);
router.post('/nearme', AuthController.setShowNearMe);

router.get('/logout', middlewares.checkAuthentication, AuthController.logout);
router.get('/avatars/:username',AuthController.getAvatar);

module.exports = router;
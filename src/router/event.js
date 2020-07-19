const express = require('express');
const router = express.Router();
const multer = require( 'multer');
const middlewares = require('../middleware');
const EventController = require('../controllers/event');

const upload = multer({
    dest: __dirname+"/../../tmpImages"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});



router.post('/:username', EventController.uploadCalendar);
router.post('/users/:userId/addEvent',EventController.add);
router.post('/users/:userId/addUser',EventController.addUser);
router.post('/users/:userId/addImage',upload.single("image"), EventController.addImage);

router.get('/all',EventController.listAll);
router.get('/:eventId',EventController.listEvent);
router.get('/images/:eventId',EventController.getImage);
router.get('/users/:userId',EventController.listAllEventByUserId);

router.put('/users/events/:event_id',EventController.update);

router.delete('/:event_id', EventController.remove);
router.delete('/:username',EventController.deleteCalendar);

module.exports = router;
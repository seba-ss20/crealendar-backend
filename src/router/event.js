const express = require('express');
const router = express.Router();

const middlewares = require('../middleware');
const EventController = require('../controllers/event');


router.post('/:username', EventController.uploadCalendar);
router.post('/users/:userId/addEvent',EventController.add);

router.get('/:userId',EventController.listAll);
router.get('/:eventId',EventController.listEvent);
router.get('/users/:userId',EventController.listAllEventByUserId);

router.put('/users/events/:event_id',EventController.update);

router.delete('/:event_id', EventController.remove);
router.delete('/:username',EventController.deleteCalendar);

module.exports = router;
"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middleware');
const EventController = require('../controllers/event');


router.post('/:username', middlewares.checkAuthentication,EventController.uploadCalendar);
router.post('/:username/:event_id',middlewares.checkAuthentication,EventController.add);
router.get('/:username',middlewares.checkAuthentication,EventController.listAll);
router.get('/:username/:event_id',middlewares.checkAuthentication,EventController.listEvent);
router.put('/:username/:event_id', middlewares.checkAuthentication,EventController.update);
router.delete('/:username/:event_id', middlewares.checkAuthentication, EventController.remove);
router.delete('/:username',middlewares.checkAuthentication,EventController.deleteCalendar);

module.exports = router;
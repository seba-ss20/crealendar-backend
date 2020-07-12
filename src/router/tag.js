"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middleware');
const TagController = require('../controllers/tag');


router.post('/:username', middlewares.checkAuthentication,TagController.addTagToUser);
router.post('/:event_id',middlewares.checkAuthentication,TagController.addTagToEvent);
router.post('/set/:username',middlewares.checkAuthentication,TagController.setTagsOfUser);

router.get('/:username',middlewares.checkAuthentication,TagController.getTagsOfUser);
router.get('/:event_id',middlewares.checkAuthentication,TagController.getTagsOfEvent);
router.get('/',middlewares.checkAuthentication,TagController.listTags);

router.delete('/:username',middlewares.checkAuthentication,TagController.removeTagFromUser);
router.delete('/:event_id', middlewares.checkAuthentication, TagController.removeTagFromEvent);

module.exports = router;
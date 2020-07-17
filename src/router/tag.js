const express = require('express');
const router = express.Router();

const middlewares = require('../middleware');
const TagController = require('../controllers/tag');


router.post('/:username', TagController.addTagToUser);
router.post('/:event_id', TagController.addTagToEvent);
router.post('/set/:username', TagController.setTagsOfUser);

router.get('/:username', TagController.getTagsOfUser);
router.get('/:event_id',TagController.getTagsOfEvent);
router.get('/', TagController.listTags);

router.delete('/:username', TagController.removeTagFromUser);
router.delete('/:event_id', TagController.removeTagFromEvent);

module.exports = router;
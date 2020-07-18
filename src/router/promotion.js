const express = require('express');
const router = express.Router();

const PromotionController = require('../controllers/promotion');


//router.post('/:username', EventController.uploadCalendar);
router.post('/users/:userId/addPromotion',PromotionController.add);

router.get('users/:username',PromotionController.listAll);
router.get('/:promotionId',PromotionController.listPromotion);
router.get('/users/:userId',PromotionController.listAllPromotionByUserId);

router.put('/users/promotions/:promotion_id',PromotionController.update);

router.delete('/:promotion_id', PromotionController.remove);
//router.delete('/:username',EventController.deleteCalendar);

module.exports = router;
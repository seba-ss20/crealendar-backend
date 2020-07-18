const config     = require('../config');
const PromotionModel  = require('../models/Promotion');
const UserProfileModel  = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const add = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    try {
        let promotion = await PromotionModel.create(req.body);

        return res.status(201).json(promotion)
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const listAll  = async (req, res) => {
    try {
        let promotions = await PromotionModel.find({}).exec();
        return res.status(200).json(promotions);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const listPromotion = async (req, res) => {
    try {
        let promotion = await PromotionModel.findById(req.params.promotionId).exec();
        if (!promotion) return res.status(404).json({
            error: 'Not Found',
            message: `Promotion not found`
        });

        return res.status(200).json(promotion)
    } catch(err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};
const remove = async (req, res) => {
    try {
        await PromotionModel.findByIdAndRemove(req.params.promotion_id).exec();
        return res.status(200).json({message: `Promotion with id${req.params.id} was deleted`});
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};
const update = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    try {
        let promotion = await PromotionModel.findByIdAndUpdate(req.params.promotion_id, req.body, {
            new: true,
            runValidators: true
        }).exec();

        return res.status(200).json(promotion);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const listAllPromotionByUserId = async (req, res) => {
    try {
        let promotions = await PromotionModel.find({owner: req.params.userId}).exec();
        return res.status(200).json(promotions);
    } catch(err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};


module.exports = {
    add,
    listAll,
    listPromotion,
    listAllPromotionByUserId,
    update,
    remove
};
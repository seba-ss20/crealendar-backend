"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const middlewares = require('./middleware');

const auth  = require('./router/auth');
const event  = require('./router/event');
const tag = require('./router/tag');

const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);


// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'SEBA Master Movie Backend'
    });
});

// API routes
api.use('/auth'  , auth);
api.use('/event', event);
api.use('/tag', tag);

module.exports = api;
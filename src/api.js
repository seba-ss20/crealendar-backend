const path = require('path');

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const middlewares = require('./middleware');

const auth  = require('./router/auth');
const event  = require('./router/event');
const tag = require('./router/tag');
const user = require('./router/user');
const eventPage  = require('./router/eventPage');
const promotion  = require('./router/promotion');
const imagePath = path.join(__dirname,'/../images/');
const api = express();

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);

// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'SEBA Master Crealendar Backend'
    });
});


// API routes
api.use('/auth'  , auth);
api.use('/event', event);
api.use('/tag', tag);
api.use(user);
api.use('/eventPage', eventPage);
api.use('/promotion', promotion);

module.exports = api;
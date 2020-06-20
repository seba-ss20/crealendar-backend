"use strict";

// Configuration variables
const port      = process.env.PORT        || '3001';
const mongoURI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/crealendardb';
const JwtSecret = process.env.JWT_SECRET  || 'very secret secret';


module.exports = {
    port,
    mongoURI,
    JwtSecret,
};
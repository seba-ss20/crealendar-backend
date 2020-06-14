"use strict";

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const port = 3001;


mongoose.connect('mongodb://localhost:3002', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})

const app = express();
app.use(express.json())
app.use(cors());

app.listen(port, function () {
	console.log("Server running on port "+ port);
});


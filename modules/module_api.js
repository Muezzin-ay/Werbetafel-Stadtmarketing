const express = require('express');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');


// Own Modules
let database = require('./db');

// Constants
const api = express.Router();


api.get('/getPr', (req, res) => {
    database.readPresentations(res);
});

api.get('/createPr', (req, res) => {
    database.createPresentation(res);
});

api.get('/getSlides', (req, res) => {
    database.getSlides(res);
});

api.get('/del', (req, res) => {
    database.deleteSlide(req.query.id, res);
});

api.get('/presentationCount', (req, res) => {
    
});

module.exports = api;
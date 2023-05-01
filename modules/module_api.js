const express = require('express');
const multer = require('multer');
const fs = require('fs');
//const bodyParser = require('body-parser');


// Own Modules
let database = require('./db');
let convert = require('./convert')

// Constants
const api = express.Router();

const slideDest = './public/slides/';
const upload = multer({ dest:  slideDest + "temp/"})


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


api.post('/upload', upload.single('pdf-file'), function(req, res) {
    try {
        let oldPath = slideDest + "temp/" + req.file.filename;
        let newPath = slideDest + "temp/" + req.file.originalname;
        fs.rename(oldPath, newPath, async function () {
            let imgOut = slideDest + "temp/";
            await convert.createSlidesFromPdf(newPath, imgOut);
            res.status(200);
        });
    } catch (error) {
        res.status(500).send('Server is occured.')
        console.log(error);
    }
});


module.exports = api;
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');

const { Progress } = require('express-progressbar');


// Own Modules
let database = require('./db');
let convert = require('./convert')

// Constants
const api = express.Router();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended:true}));

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

api.post('/deleteSlide', (req, res) => {
    let data = req.body.slideInfo;
    convert.deleteImageFile(data.slideID, data.presentationID, res)
});

api.get('/getSettings', (req, res) => {
    database.readSettings(res);
});

api.post('/changeSettings', (req, res) => {
    let data = req.body.settings;
    database.writeSettings(data, res);
});

api.post('/changeOrder', (req, res) => {
    let data = req.body.sequence;
    database.swapPresentationSequence(data, res);
});


api.post('/upload', upload.single('pdf-file'), function(req, res) {
    try {
        const feedbackHandler = new Progress(res);

        feedbackHandler.update(1); //[Status] Received File
        let oldPath = slideDest + "temp/" + req.file.filename;
        let newPath = slideDest + "temp/" + req.file.originalname;
        fs.rename(oldPath, newPath, async function () {
            let imgOut = slideDest + "temp/";
            await convert.createSlidesFromPdf(newPath, imgOut, feedbackHandler);
            res.end();
        });
    } catch (error) {
        res.status(500).send('Server is occured.')
        console.log(error);
    }
});



module.exports = api;
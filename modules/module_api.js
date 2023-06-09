
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');

const { Progress } = require('express-progressbar');


// Own Modules
let database = require('./db');
let convert = require('./convert');
const db = require('./db');

// Constants
const api = express.Router();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended:true}));

const slideDest = './public/slides/';
const upload = multer({ dest:  slideDest + "temp/"})
 

api.get('/getPr', (req, res) => { // Admin panel
    database.readFirstSlide(res);
});

api.get('/getSlides', (req, res) => { //RevealJs show
    database.readAllSlides(res);
});

api.get('/createPr', (req, res) => {
    database.createPresentation(res);
});

api.post('/changePresentationVisbility', (req, res) => {
    let data = req.body.presentationInfo;
    database.setPresentationVisibility(data, req.io, res);
});

api.post('/deletePresentation', (req, res) => {
    let data = req.body.presentationInfo;
    database.deletePresentation(data, req.io, res, convert.deleteImageFile)
});

api.get('/getSettings', (req, res) => {
    database.readSettings(res);
});

api.post('/changeSettings', (req, res) => {
    let data = req.body.settings;
    database.writeSettings(data, req.io, res);
});

api.post('/changeOrder', (req, res) => {
    let data = req.body.sequence;
    database.swapPresentationSequence(data, req.io, res);
});

api.post('/changeSlideSequence', (req, res) => {
    database.changeSlideSequence(req.body.slideSequence, req.io, res);
});

api.post('/upload', upload.single('pdf-file'), function(req, res) {
    try {
        const feedbackHandler = new Progress(res);

        let presentationInfo = JSON.parse(req.body.presentationInfo)
        feedbackHandler.update(1); //[Status] Received File
        let oldPath = slideDest + "temp/" + req.file.filename;
        let newPath = slideDest + "temp/" + req.file.originalname;
        fs.rename(oldPath, newPath, async function () {
            let imgOut = slideDest + "temp/";
            await convert.createSlidesFromPdf(newPath, imgOut, presentationInfo, feedbackHandler, req.io);
        });
    } catch (error) {
        res.status(500).send('Server is occured.')
        console.log(error);
    }
});



module.exports = api;
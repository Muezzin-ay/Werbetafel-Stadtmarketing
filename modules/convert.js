
const { Poppler } = require('node-poppler');
const fs = require('fs');
const path = require('path');

const db = require('./db');


module.exports = {
    createSlidesFromPdf : async function(pdfFile, imgOut, feedbackHandler) {
        const poppler = new Poppler("/usr/bin");
        const options = {
            firstPageToConvert: 1,
            pngFile: true,
            resolutionXAxis: 400,
            resolutionXYAxis: 400
        }
        let output = imgOut + "slide"
        feedbackHandler.update( {status : 2} ); //[Status] Start converting
        const res = await poppler.pdfToCairo(pdfFile, output, options);
        feedbackHandler.update( {status : 3} ); //[Status] End converting

        fs.unlinkSync(pdfFile);
        fs.readdir(imgOut, (err, files) => {
            db.createPresentation(files, (filename, slideID, presentationID) => {
                oldPath = path.join(__dirname, `/../public/slides/temp/${filename}`);
                newPath = path.join(__dirname, `/../public/slides/Slide-Pr${presentationID}-${slideID}.png`);
                fs.rename(oldPath, newPath, (err)=> {
                    if (err) {
                        console.log(err);
                    };
                });
            });
        });


    }
}
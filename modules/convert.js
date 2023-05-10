
const { Poppler } = require('node-poppler');
const fs = require('fs');
const path = require('path');

const db = require('./db');


module.exports = {
    createSlidesFromPdf : async function(pdfFile, imgOut, presentationInfo, feedbackHandler) {
        const poppler = new Poppler("/usr/bin");
        const options = {
            firstPageToConvert: 1,
            pngFile: true,
            resolutionXAxis: 400,
            resolutionXYAxis: 400
        }
        let output = imgOut + "slide"
        const res = await poppler.pdfToCairo(pdfFile, output, options);
        feedbackHandler.update(2); //[Status] End converting

        fs.unlinkSync(pdfFile);
        fs.readdir(imgOut, (err, files) => {
            db.createPresentation(files, presentationInfo, (filename, slideID, presentationID) => {
                oldPath = path.join(__dirname, `/../public/slides/temp/${filename}`);
                newPath = path.join(__dirname, `/../public/slides/Slide-Pr${presentationID}-${slideID}.png`);
                fs.rename(oldPath, newPath, (err)=> {
                    if (err) {
                        console.log(err);
                    };
                });
            });
        });
    },

    deleteImageFile : async function(slide, res) {
        let presentationID = slide.dataValues.PFk;
        let slideID = slide.dataValues.ID;
        let slidePath = path.join(__dirname, `/../public/slides/Slide-Pr${presentationID}-${slideID}.png`);
        fs.unlink(slidePath, (err) => {});
    }
}
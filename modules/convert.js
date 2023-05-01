
const { Poppler } = require('node-poppler');
const fs = require('fs');
const path = require('path');

const db = require('./db');


module.exports = {
    createSlidesFromPdf : async function(pdfFile, imgOut) {
        const poppler = new Poppler("/usr/bin");
        const options = {
            firstPageToConvert: 1,
            pngFile: true,
            resolutionXAxis: 400,
            resolutionXYAxis: 400
        }
        let output = imgOut + "slide"
        const res = await poppler.pdfToCairo(pdfFile, output, options);

        fs.unlinkSync(pdfFile);
        fs.readdir(imgOut, (err, files) => {
            db.createPresentation(files.length, (fileTag, slideID, presentationID) => {
                oldPath = path.join(__dirname, `/../public/slides/temp/slide-${fileTag}.png`);
                newPath = path.join(__dirname, `/../public/slides/Slide-Pr${presentationID}-${slideID}.png`);
                fs.rename(oldPath, newPath, (err)=> {
                    if (err) {
                        console.log(err);
                    };
                });
            });
            /*
            db.createPresentation(files.length, (presentationId) => {  
                const presentationFolder = path.join(__dirname, `/../public/slides/pr${presentationId}`);            
                files.forEach(file => {
                    if (err) {
                        console.log(err);
                    };
                    oldPath = path.join(__dirname, `/../public/slides/temp/${file}`);
                    newPath = path.join('/../public/slides/', file);
                    fs.rename(oldPath, newPath, (err)=> {
                        if (err) {
                            console.log(err);
                        };
                    });
                });
            

            })
            */
        });


    }
}
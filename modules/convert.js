
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
            db.createPresentation(files.length, (presentationId) => {                
                files.forEach(file => {
                    const presentationFolder = path.join(__dirname, `/../public/slides/pr${presentationId}`);
                    if (!fs.existsSync(presentationFolder)) {
                        fs.mkdir(presentationFolder, (err) => {
                            if (err) {
                                console.log(err);
                            };
                            oldPath = path.join(__dirname, `/../public/slides/temp/${file}`);
                            newPath = path.join(__dirname, presentationFolder, `/${file}`);
                            fs.rename(oldPath, newPath, (err)=> {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        })
                    }
                    
                    
                });

            })
        });


    }
}

const { Poppler } = require('node-poppler')


module.exports = {
    convertFromPdf : async function(pdfFile, imgOut) {
        const poppler = new Poppler("/usr/bin");
        const options = {
            firstPageToConvert: 1,
            pngFile: true,
            resolutionXAxis: 400,
            resolutionXYAxis: 400
        }
        let output = imgOut + "slide"
        const res = await poppler.pdfToCairo(pdfFile, output, options);
    }
}
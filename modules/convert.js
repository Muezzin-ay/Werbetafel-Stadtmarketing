
const { Poppler } = require('node-poppler')


module.exports = {
    convert_from_pdf : async function(file_name) {
        let file = 'test.pdf';
        const poppler = new Poppler("/usr/bin");
        const options = {
            firstPageToConvert: 1,
            pngFile: true,
            resolutionXAxis: 400,
            resolutionXYAxis: 400
        }
        let output_file = 'test_from_pdf.png';

        const res = await poppler.pdfToCairo(file, 'img', options);

    }
}
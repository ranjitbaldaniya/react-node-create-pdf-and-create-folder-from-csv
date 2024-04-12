const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

const editPdf = async (req, res) => {
  try {

    // // console.log("callleeeddd")
    // // Read the PDF file
    // const pdfBytes = await fs.readFile('sample.pdf');

    // // console.log("padBytes ==>" , pdfBytes)
    // // Create a new PDFDocument
    // const pdfDoc = await PDFDocument.load(pdfBytes);

    // // Create a new PDF containing only the first page
    // const newPdfDoc = await PDFDocument.create();
    // const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [0]); // Select the first page
    // newPdfDoc.addPage(copiedPage);

    // // Serialize the new PDF to bytes
    // const newPdfBytes = await newPdfDoc.save();

    // // Write the new PDF bytes to a file
    // await fs.writeFile('newPdf.pdf', newPdfBytes);

    res.send("its working")

    console.log('New PDF file created successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
};


module.exports = {
    editPdf,
  };
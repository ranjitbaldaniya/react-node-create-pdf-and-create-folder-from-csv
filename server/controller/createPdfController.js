const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path"); // Import the path module

const createPdf = async (req, res) => {
  // console.log("create pdf route call ==>", req.file);

  const { path: pdfFilePath } = req.file;
  const selectedPages = JSON.parse(req.body.selectedPages);
  // console.log(" selectedPages ==>", selectedPages, pdfFilePath);

  // Check if pdfFilePath is properly defined and proceed with processing the file
  if (!pdfFilePath) {
    return res.status(400).send("PDF file path is missing");
  }

  try {
    // Read the PDF file using its path property
    const pdfBytes = await fs.readFile(pdfFilePath);
    // console.log(" pdfBytes ==>", pdfBytes);

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // console.log(" pdfDoc ==>", pdfDoc );

    // Check if any pages are selected
    if (!selectedPages || selectedPages.length === 0) {
      throw new Error("No pages selected");
    }

    // Create a new PDF containing only selected pages
    const newPdfDoc = await PDFDocument.create();
    // console.log(" newPdfDoc ==>", newPdfDoc );

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

      // Serialize the new PDF to bytes
    const newPdfBytes = await newPdfDoc.save();

    // Create the directory if it doesn't exist
    // const directoryPath = path.join(__dirname, "createdPdf");
    const directoryPath = path.join(__dirname, "../../react-js/public/createdPDF");
    // console.log(" directoryPath ==>", directoryPath);

    await fs.mkdir(directoryPath, { recursive: true });

    // Create a unique filename for the created PDF
    const fileName = `created_${Date.now()}.pdf`;

    // Define the path for the created PDF file
    const filePath = path.join(directoryPath, fileName);

    // Write the PDF bytes to the file system
    await fs.writeFile(filePath, newPdfBytes);

    // Send the path of the created PDF file in the response
    res.status(200).send({ filePath });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createPdf,
};

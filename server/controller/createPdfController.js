const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");

const createPdf = async (req, res) => {
  const { path: pdfFilePath } = req.file;
  const filesInfo = JSON.parse(req.body.selectedPages);
  let pdfPath = req.body.pdfPath;

  // console.log("filesInfo", filesInfo);
  // console.log("pdfPath", pdfPath);

  if (!pdfFilePath) {
    return res.status(400).send("PDF file path is missing");
  }

  try {
    // Read the PDF file
    const pdfBytes = await fs.readFile(pdfFilePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    if (!filesInfo || filesInfo.length === 0) {
      throw new Error("No files info provided");
    }

    // Remove trailing slash from pdfPath
    // console.log("pdfPath========>", pdfPath.slice(1, -1));

    pdfPath = path.normalize( pdfPath.slice(1, -1));
    // console.log("pdfPath===>", pdfPath);

    // Create a new PDF containing selected pages for each file
    for (const fileInfo of filesInfo) {
      const startPage = parseInt(fileInfo.startPage);
      const endPage = parseInt(fileInfo.endPage);

      if (!startPage || !endPage) {
        throw new Error("Invalid start page or end page");
      }

      if (
        startPage > endPage ||
        startPage < 1 ||
        endPage > pdfDoc.getPageCount()
      ) {
        throw new Error("Invalid page range");
      }

      // Create a new PDF containing only selected pages
      const newPdfDoc = await PDFDocument.create();

      for (let i = startPage; i <= endPage; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i - 1]);
        newPdfDoc.addPage(copiedPage);
      }

      // Serialize the new PDF to bytes
      const newPdfBytes = await newPdfDoc.save();

      // Use path.join() to concatenate directory paths safely
      const directoryPath = pdfPath;
      console.log("directoryPath===>", directoryPath);
      
      // Ensure the directory exists
      await fs.mkdir(directoryPath, { recursive: true });

      // Define the path for the created PDF file
      const fileName = `${fileInfo.name}.pdf`;
      const filePath = path.join(directoryPath, fileName);
      // console.log("filePath===>", filePath);
      
      // Write the PDF bytes to the file system
      await fs.writeFile(filePath, newPdfBytes);
    }

    res.status(200).json({ message: "PDFs created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createPdf,
};

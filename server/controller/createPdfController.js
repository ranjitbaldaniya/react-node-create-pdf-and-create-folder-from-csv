const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");

const createPdf = async (req, res) => {
  const { path: pdfFilePath } = req.file;
  const filesInfo = JSON.parse(req.body.selectedPages);
  let pdfPath = req.body.pdfPath;

  console.log("filesInfo", filesInfo);
  console.log("pdfPath", pdfPath);

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

    pdfPath = path.normalize(pdfPath.slice(1, -1));
    // console.log("pdfPath===>", pdfPath);

    // Create a new PDF containing selected pages for each file
    for (const fileInfo of filesInfo) {
      console.log("fileinfor ==>", fileInfo);

      // Extract file information
      const fileName = fileInfo.name;
      const selectedPages = fileInfo.selectedPages.split(",").map(Number);

      // Create a new PDF containing only selected pages
      const newPdfDoc = await PDFDocument.create();

      for (const pageNumber of selectedPages) {
        if (pageNumber < 1 || pageNumber > pdfDoc.getPageCount()) {
          throw new Error(`Invalid page number: ${pageNumber}`);
        }
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [
          pageNumber - 1,
        ]);
        newPdfDoc.addPage(copiedPage);
      }

      // Serialize the new PDF to bytes
      const newPdfBytes = await newPdfDoc.save();

      // Ensure the directory exists
      await fs.mkdir(pdfPath, { recursive: true });

      // Define the path for the created PDF file
      const filePath = path.join(pdfPath, `${fileName}.pdf`);

      // Write the PDF bytes to the file system
      await fs.writeFile(filePath, newPdfBytes);

      console.log(`PDF created: ${filePath}`);
    }
    res.status(200).json({ message: "PDFs created successfully" });
  } catch (error) {
    console.log("Error==>", error);
    if (error.message.startsWith("Invalid page number")) {
      res.status(400).json({ error: error.message });
    } else if (error.message === "No files info provided") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  createPdf,
};

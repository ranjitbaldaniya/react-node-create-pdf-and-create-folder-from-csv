const express = require("express");
const cors = require("cors");
const createFolderRoutes = require("./routes/createFolderRoute");
const createPdfRoutes = require("./routes/createPdfRoute");
const multer = require("multer");
const { editPdf } = require("./controller/editPdf");

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ dest: "pdfs/" });

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", editPdf);

// Routes
app.use("/", createFolderRoutes);
app.use("/", upload.single("pdfFile"), createPdfRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT }`);
});

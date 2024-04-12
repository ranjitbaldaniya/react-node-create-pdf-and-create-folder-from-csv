const express = require("express");
const { createPdf } = require("../controller/createPdfController");
const router = express.Router();

// Define routes
router.post("/createPDF", createPdf);

module.exports = router;

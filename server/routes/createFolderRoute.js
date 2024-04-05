const express = require("express");
const { createFolders } = require("../controller/createFolderController");
const router = express.Router();

// Define routes
router.post("/createFolders", createFolders);

module.exports = router;

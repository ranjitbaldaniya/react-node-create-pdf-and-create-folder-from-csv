const express = require("express");
const cors = require("cors");
const createFolderRoutes = require("./routes/createFolderRoute");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Routes
app.use("/", createFolderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

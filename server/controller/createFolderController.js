const fs = require("fs");
const path = require("path");

const createFolders = (req, res) => {
  const { selectedDoctors, selectedPath } = req.body;

  if (!Array.isArray(selectedDoctors)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const appFolderPath = selectedPath;

    const existingDoctorNames = fs.readdirSync(appFolderPath);

    selectedDoctors.forEach((doctor) => {
      const doctorFolderName = `${doctor.doctorName}`;
      if (existingDoctorNames.includes(doctorFolderName)) {
        console.log(`${doctorFolderName} already exists, skipping...`);
        return;
      }

      const doctorFolderPath = path.join(appFolderPath, doctorFolderName);
      const dateFolderPath = path.join(doctorFolderPath, doctor.todaysDate);

      if (!fs.existsSync(doctorFolderPath)) {
        fs.mkdirSync(doctorFolderPath, { recursive: true });
      }
      if (!fs.existsSync(dateFolderPath)) {
        fs.mkdirSync(dateFolderPath, { recursive: true });
      }

      const existingVendorNames = fs.readdirSync(dateFolderPath);

      const vendorFolderPath = path.join(dateFolderPath, doctor.vendor);
      if (!existingVendorNames.includes(doctor.vendor)) {
        fs.mkdirSync(vendorFolderPath, { recursive: true });
      }

      const reportType = doctor.reportType === "Retrospective" ? "Resrospective" : "Prospective";
      const reportTypeFolderPath = path.join(vendorFolderPath, reportType);

      if (!fs.existsSync(reportTypeFolderPath)) {
        fs.mkdirSync(reportTypeFolderPath, { recursive: true });
      }

      const finalFolderPath = path.join(reportTypeFolderPath, `${doctor.docId} ${doctor.patientName}`);
      if (!fs.existsSync(finalFolderPath)) {
        fs.mkdirSync(finalFolderPath, { recursive: true });
      }
     // Copy the .docx files to the final folder
        const docxFilePaths = [
            path.join(__dirname, "DAIGNOSIS.docx"),
          path.join(__dirname, "SPECIAL_INSTRUCTIONS.docx")
        ];
        docxFilePaths.forEach((docxFilePath) => {
          const fileName = path.basename(docxFilePath);
          const destinationPath = path.join(finalFolderPath, fileName);
          fs.copyFileSync(docxFilePath, destinationPath);
        })
    });

    return res.status(200).json({ message: "Folders created successfully" });
  } catch (error) {
    console.error("Error creating folders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFolders
};

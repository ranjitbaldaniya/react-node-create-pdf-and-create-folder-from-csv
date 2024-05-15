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
      const doctorFolderName = `${doctor.doctorName}`.toUpperCase(); // Capitalize folder name
      if (existingDoctorNames.includes(doctorFolderName)) {
        console.log(`${doctorFolderName} already exists, skipping...`);
        return;
      }

      const doctorFolderPath = path.join(appFolderPath, doctorFolderName);
      const formattedDate = formatDate(doctor.todaysDate); // Format date
      const dateFolderPath = path.join(doctorFolderPath, formattedDate);

      if (!fs.existsSync(doctorFolderPath)) {
        fs.mkdirSync(doctorFolderPath, { recursive: true });
      }
      if (!fs.existsSync(dateFolderPath)) {
        fs.mkdirSync(dateFolderPath, { recursive: true });
      }
      console.log("vendor ==>", doctor.vendor);
      // let vendorFolderPath;
      // if (doctor.vendor === "Geico") {
      //   vendorFolderPath = path.join(dateFolderPath, "GEICO");
      // } else {
      //   const nonGeicoFolderPath = path.join(dateFolderPath, "NON-GEICO");
      //   if (!fs.existsSync(nonGeicoFolderPath)) {
      //     fs.mkdirSync(nonGeicoFolderPath, { recursive: true });
      //   }
      //   vendorFolderPath = path.join(nonGeicoFolderPath, doctor.vendor.toUpperCase()); // Capitalize vendor name
      // }
      let vendorFolderPath;
      if (doctor.vendor === "GEICO") {
        vendorFolderPath = path.join(dateFolderPath, "GEICO");
      } else {
        const nonGeicoFolderPath = path.join(dateFolderPath, "NON-GEICO");
        if (!fs.existsSync(nonGeicoFolderPath)) {
          fs.mkdirSync(nonGeicoFolderPath, { recursive: true });
        }
        vendorFolderPath = path.join(
          nonGeicoFolderPath,
          doctor.vendor.toUpperCase()
        ); // Capitalize vendor name
      }

      const reportType =
        doctor.reportType === "Retrospective" ? "Resrospective" : "Prospective";
      const reportTypeFolderPath = path.join(
        vendorFolderPath,
        reportType.toUpperCase()
      ); // Capitalize report type

      if (!fs.existsSync(reportTypeFolderPath)) {
        fs.mkdirSync(reportTypeFolderPath, { recursive: true });
      }

      const finalFolderPath = path.join(
        reportTypeFolderPath,
        `${doctor.docId} ${doctor.patientName}`.toUpperCase() // Capitalize final folder name
      );
      if (!fs.existsSync(finalFolderPath)) {
        fs.mkdirSync(finalFolderPath, { recursive: true });
      }
      // Copy the .docx files to the final folder
      const docxFilePaths = [
        path.join(__dirname, "DAIGNOSIS.docx"),
        path.join(__dirname, "SPECIAL_INSTRUCTIONS.docx"),
      ];
      docxFilePaths.forEach((docxFilePath) => {
        const fileName = path.basename(docxFilePath);
        const destinationPath = path.join(finalFolderPath, fileName);
        fs.copyFileSync(docxFilePath, destinationPath);
      });
    });

    return res.status(200).json({ message: "Folders created successfully" });
  } catch (error) {
    console.error("Error creating folders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to format date
function formatDate(dateString) {
  const parts = dateString.match(/(\d+)/g);
  if (parts.length === 3) {
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  }
  return dateString; // Return as is if not in expected format
}

module.exports = {
  createFolders,
};

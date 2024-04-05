import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Spinner,
  FormGroup,
  Label,
  InputGroup,
} from "reactstrap";
import * as XLSX from "xlsx";

const CreateFolder = () => {
  const [error, setError] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  console.log("selectedDoctors path ===>", selectedDoctors);

  const [selectedPath, setSelectedPath] = useState("");

  console.log("selected path ===>", selectedPath);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log("parsed xlsx data ===>", parsedData);
        const docIdIndex = parsedData[0].indexOf("DOC ID");
        const doctorNameIndex = parsedData[0].indexOf("Doctor name");
        const todaysDateIndex = parsedData[0].indexOf("Today's Date");
        const reportTypeIndex = parsedData[0].indexOf("Report type");
        const patientNameIndex = parsedData[0].indexOf("Patient name");
        const vendorIndex = parsedData[0].indexOf("vendor");
        const doctorsArray = parsedData.slice(1).map((row) => ({
          docId: row[docIdIndex],
          doctorName: row[doctorNameIndex],
          todaysDate: row[todaysDateIndex],
          reportType: row[reportTypeIndex],
          patientName: row[patientNameIndex],
          vendor: row[vendorIndex],
        }));

        setExcelData(doctorsArray);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload an Excel file (.xlsx).");
    }
  };

  const handleRemoveFile = () => {
    setExcelData([]);
    setSelectedDoctors([]);
    setSelectedPath("");
    setError(null);
    // Reset the input field value
    const input = document.getElementById("fileInput");
    if (input) {
      input.value = null;
    }
  };

  const handleDoctorCheckboxChange = (selectedDoctor) => {
    setSelectedDoctors((prevSelectedDoctors) => {
      if (
        prevSelectedDoctors.some(
          (doctor) => doctor.docId === selectedDoctor.docId
        )
      ) {
        return prevSelectedDoctors.filter(
          (doctor) => doctor.docId !== selectedDoctor.docId
        );
      } else {
        return [...prevSelectedDoctors, selectedDoctor];
      }
    });
  };

  const handleCreateFolder = () => {
    handleFoldersDataSubmit();
  };

  const handleFoldersDataSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/createFolders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDoctors, selectedPath }),
      });
      if (!response.ok) {
        throw new Error("Failed to create folders");
      }
      handleRemoveFile();
    } catch (error) {
      console.error("Error creating folders:", error);
      setError("Failed to create folders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="mt-5">
            <h1>Excel Folder Creator</h1>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              id="fileInput"
            />
            {error && <div className="text-danger">{error}</div>}
          </div>
        </Col>

        <Col md={12} className="mt-5">
          {loading ? (
            <Spinner color="primary" />
          ) : (
            excelData.length > 0 && (
              <div>
                <h2>Uploaded Excel Data:</h2>

                <Row>
                  <Col md={6}>
                    <FormGroup className="ms-3 mb-0">
                      <Label for="folderPath">Enter Folder Path:</Label>
                      <InputGroup>
                        <Input
                          type="text"
                          id="folderPath"
                          placeholder="Enter folder path..."
                          value={selectedPath}
                          onChange={(e) => setSelectedPath(e.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    {" "}
                    <div className="d-flex justify-content-end mb-2">
                      <Button color="danger" onClick={handleRemoveFile}>
                        Remove Uploaded File
                      </Button>

                      <Button
                        className="ms-3"
                        color="primary"
                        onClick={handleCreateFolder}
                        disabled={
                          selectedPath.length === 0 ||
                          selectedDoctors.length <= 0
                        }
                      >
                        Create Folder
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {excelData.map((doctor, index) => (
                    <Col md={3} key={index}>
                      <Card
                        className="mb-3 "
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDoctorCheckboxChange(doctor)}
                      >
                        <CardBody style={{ position: "relative" }}>
                          <Input
                            type="checkbox"
                            id={`doctor-${doctor.docId}`}
                            checked={selectedDoctors.some(
                              (selectedDoctor) =>
                                selectedDoctor.docId === doctor.docId
                            )}
                            onChange={() => handleDoctorCheckboxChange(doctor)}
                            style={{
                              position: "absolute",
                              top: "-2px",
                              right: "1px",
                              cursor: "pointer",
                            }}
                          />
                          <label
                            htmlFor={`doctor-${doctor.docId}`}
                            className="ml-2"
                          >
                            {doctor.doctorName} - {doctor.docId}
                          </label>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreateFolder;

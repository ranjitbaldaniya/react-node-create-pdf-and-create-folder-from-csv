import React, { useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Input } from "reactstrap";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const UploadPDF = () => {
  const initialFileInfo = { name: "", startPage: "", endPage: "" };

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [filesInfo, setFilesInfo] = useState([initialFileInfo]);
  const [pdfPath, setPdfPath] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    setSuccessMessage("");
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPdfFile(file);
    setPageNumber(1);
  };

  const addMoreFields = () => {
    setFilesInfo([...filesInfo, initialFileInfo]);
  };

  const removeFields = (indexToRemove) => {
    setFilesInfo(filesInfo.filter((_, index) => index !== indexToRemove));
  };

  const handleFileNameChange = (index, value) => {
    const updatedFilesInfo = [...filesInfo];
    updatedFilesInfo[index].name = value;
    setFilesInfo(updatedFilesInfo);
  };

  const handleStartPageChange = (index, value) => {
    const updatedFilesInfo = [...filesInfo];
    updatedFilesInfo[index].startPage = value;
    setFilesInfo(updatedFilesInfo);
  };

  const handleEndPageChange = (index, value) => {
    const updatedFilesInfo = [...filesInfo];
    updatedFilesInfo[index].endPage = value;
    setFilesInfo(updatedFilesInfo);
  };

  const handlePdfPathChange = (e) => {
    setPdfPath(e.target.value);
  };

  const clearForm = () => {
    setPdfFile(null);
    setFilesInfo([initialFileInfo]);
    setPdfPath("");
    setError("");
    setSuccessMessage("PDFs created successfully");
  };

  const createPdf = async () => {
    // Check if any required field is empty
    const isAnyFieldEmpty = filesInfo.some(
      (info) => !info.name || !info.startPage || !info.endPage
    );

    if (!pdfPath || isAnyFieldEmpty) {
      setError("Please fill all required fields.");
      return;
    }

    // Log PDF row data, selected pages array, and path
    console.log("PDF Row Data:", filesInfo);
    console.log("PDF Path:", pdfPath);
    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("pdfPath", JSON.stringify(pdfPath));
    formData.append("selectedPages", JSON.stringify(filesInfo));

    try {
      const response = await fetch("http://localhost:3001/createPDF", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log("res===>", responseData);
      clearForm();
    } catch (error) {
      console.error("Error:", error);
      setError("Internal Server Error");
    }
  };

  // Clear error message
  const clearError = () => {
    setError("");
  };

  // Rendering logic for multiple file inputs
  const renderFileInputs = () => {
    return filesInfo.map((info, index) => (
      <Row key={index} className="mt-3 mb-3">
        <Col md="1"></Col>
        <Col md="3">
          <Input
            type="text"
            placeholder="File Name"
            value={info.name}
            onChange={(e) => handleFileNameChange(index, e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="number"
            placeholder="Start Page"
            value={info.startPage}
            onChange={(e) => handleStartPageChange(index, e.target.value)}
          />
        </Col>
        <Col md="2">
          <Input
            type="number"
            placeholder="End Page"
            value={info.endPage}
            onChange={(e) => handleEndPageChange(index, e.target.value)}
          />
        </Col>

        <Col md="1">
          {index === filesInfo.length - 1 && (
            <Button color="primary" onClick={addMoreFields}>
              Add
            </Button>
          )}
        </Col>
        <Col md="1">
          {index > 0 && (
            <Button
              color="danger"
              className="ms-2"
              onClick={() => removeFields(index)}
            >
              Remove
            </Button>
          )}
        </Col>

        <Col md="2"></Col>
      </Row>
    ));
  };

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center h-100 mt-2">
        <Col md={2} className="mt-5">
          <Link to={"/"}>
            <Button color="dark">Back</Button>
          </Link>
        </Col>
        <Col xs="12" md="8" className="mt-5">
          <div className="border border-black p-2 rounded mb-3">
            <input type="file" onChange={(e) => onDrop(e.target.files)} />
            <p className="font-bold mt-2 text-center text-primary me-5">
              Drag 'n' drop a PDF file here, or click to select one
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          {pdfFile && (
            <>
              <div className="d-flex  justify-content-center">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                ></Document>
              </div>

              <div className="mt-2">
                <p className="text-success">
                  Your PDF is uploaded and it has total page range is : {pageNumber || (numPages ? 1 : "--")} to{" "}
                  {numPages || "--"}
                </p>
      
              </div>
            </>
          )}
        </Col>
      </Row>
      {error && (
        <Row className="mt-2">
          <Col md={{ size: 6, offset: 3 }}>
            <p className="text-danger">{error}</p>
          </Col>
        </Row>
      )}
      {successMessage && (
        <Row className="mt-2">
          <Col md={{ size: 6, offset: 3 }}>
            <p className="text-success">{successMessage}</p>
          </Col>
        </Row>
      )}
      {pdfFile && (
        <Row className="mt-3">
          <Col md={{ size: 6, offset: 1 }}>
            <Input
              type="text"
              placeholder="Enter PDF Path"
              value={pdfPath}
              onChange={handlePdfPathChange}
            />
          </Col>
          <Col md={{ size: 3 }}>
            <Button color="primary" onClick={createPdf}>
              Create PDF
            </Button>
          </Col>
        </Row>
      )}
      {pdfFile && renderFileInputs()}
    </Container>
  );
};

export default UploadPDF;

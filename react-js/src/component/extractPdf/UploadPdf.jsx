import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Input } from "reactstrap";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const UploadPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  // console.log("selected pages ==> ", selectedPages);
  const [createdPdfPath, setCreatedPdfPath] = useState(null);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [indexError, setIndexError] = useState(false);
  const [loading, setLoading] = useState(false);
  const onDocumentLoadSuccess = ({ numPages }) => {
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

  const handlePageSelection = () => {
    const start = parseInt(startPage);
    const end = parseInt(endPage);
    if (start && end && start <= end && end <= numPages) {
      const selected = Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
      );
      setSelectedPages(selected);
      setIndexError(false); // Reset error state
    } else {
      setIndexError(true);
    }
  };

  const sendPdfToBackend = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdfFile", pdfFile);
      formData.append("selectedPages", JSON.stringify(selectedPages));

      const response = await fetch("http://localhost:3001/createPDF", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const { filePath } = responseData;

        // console.log("file path ==>", filePath);
        setCreatedPdfPath(filePath);
      } else {
        console.error("Error creating PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending PDF to the backend:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const downloadPdf = () => {
    if (createdPdfPath) {
      if (createdPdfPath) {
        // Construct the URL relative to the public folder
        const relativePath = createdPdfPath.split("react-js/public/")[1];

        // Open the PDF in a new tab
        const link = document.createElement("a");
        link.href = `${window.location.origin}/${relativePath}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPdfFile(null);
        setSelectedPages([]);
        setStartPage("");
        setEndPage("");
        setPageNumber(1);
      }
    }
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
      {pdfFile && (
        <Row className="mt-3 mb-3">
          <Col md="2"></Col>
          <Col md="2">
            <Input
              type="number"
              placeholder="Start Page"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
            />
          </Col>
          <Col md="2">
            <Input
              type="number"
              placeholder="End Page"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
            />
          </Col>
          <Col md="6">
            <Button
              color="primary"
              onClick={handlePageSelection}
              disabled={startPage === "" || endPage === "" || loading} // Disable button when loading
            >
              Confirm Pages
            </Button>

            <Button
              color="primary"
              onClick={sendPdfToBackend}
              className="ms-3"
              disabled={selectedPages.length === 0 || loading} // Disable button when no pages are selected or loading
            >
              Create PDF
            </Button>
            {createdPdfPath && ( // Render download button only if PDF is created
              <Button onClick={downloadPdf} className="ms-3">
                Download PDF
              </Button>
            )}
          </Col>
          {indexError && (
            <>
              <p className="text-danger text-center">
                Please enter valid input!!
              </p>
            </>
          )}
        </Row>
      )}
      <Row>
        <Col md="12">
          {pdfFile && (
            <>
              <div className="d-flex  justify-content-center">
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    pageNumber={pageNumber}
                    className="border border-black rounded"
                    width={550}
                    height={400}
                  />
                </Document>
              </div>

              <div className="mt-2">
                <Button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={previousPage}
                  className="me-5"
                >
                  Previous
                </Button>
                <span>
                  Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                  {numPages || "--"}
                </span>
                <Button
                  type="button"
                  disabled={pageNumber >= numPages}
                  onClick={nextPage}
                  className="ms-5"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UploadPDF;

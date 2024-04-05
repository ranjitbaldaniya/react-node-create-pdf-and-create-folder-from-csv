import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Container, Row, Col, Button } from 'reactstrap';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const UploadPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);

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

  return (
    <Container fluid className="h-80vh">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs="12" md="8">
          <div className="border border-black p-2 rounded ">
            <input type="file" onChange={(e) => onDrop(e.target.files)} className="border border-black p-2 rounded" />
            <p className="font-bold">Drag 'n' drop a PDF file here, or click to select one</p>
          </div>
          {pdfFile && (
            <div className="text-center">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                className="m-5 p-5"
              >
                <Page
                  pageNumber={pageNumber}
                  className="border border-black rounded"
                  // width={Math.max(pageWidth * 0.8, 390)}
                />
              </Document>
              <div className="page-nav">
                <Button type="button"  disabled={pageNumber <= 1} onClick={previousPage}>
                  Previous
                </Button>
                <span>Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}</span>
                <Button type="button" disabled={pageNumber >= numPages} onClick={nextPage}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UploadPDF;

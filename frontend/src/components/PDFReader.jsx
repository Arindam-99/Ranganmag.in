import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
// CSS imports removed due to path issues - styling handled in App.css

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReader = ({ pdfUrl, title }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInput, setPageInput] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("PDF লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
    setLoading(false);
  };

  // Navigation functions
  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= numPages) {
        setCurrentPage(pageNumber);
        setPageInput(pageNumber.toString());
      }
    },
    [numPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        prevPage();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextPage();
      } else if (event.key === "Home") {
        goToPage(1);
      } else if (event.key === "End") {
        goToPage(numPages);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextPage, prevPage, goToPage, numPages]);

  // Handle page input change
  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber)) {
      goToPage(pageNumber);
    }
  };

  // Zoom functions
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.2);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Generate page thumbnails for navigation
  const generatePageList = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(numPages, currentPage + 5);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="pdf-reader-loading text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3 bengali-text">PDF লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="bengali-text">
        {error}
      </Alert>
    );
  }

  return (
    <div
      className={`pdf-reader ${isFullscreen ? "pdf-reader-fullscreen" : ""}`}
    >
      {/* PDF Reader Header */}
      <div className="pdf-reader-header bg-white border-bottom p-3 sticky-top">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h5 className="bengali-text mb-0 text-truncate">{title}</h5>
          </div>

          <div className="col-md-4 text-center">
            {/* Page Navigation */}
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={prevPage}
                disabled={currentPage <= 1}
              >
                ←
              </Button>

              <Form onSubmit={handlePageInputSubmit} className="d-inline-block">
                <InputGroup size="sm" style={{ width: "120px" }}>
                  <Form.Control
                    type="text"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    className="text-center"
                  />
                  <InputGroup.Text>/ {numPages}</InputGroup.Text>
                </InputGroup>
              </Form>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={nextPage}
                disabled={currentPage >= numPages}
              >
                →
              </Button>
            </div>
          </div>

          <div className="col-md-4 text-end">
            {/* Zoom and Fullscreen Controls */}
            <div className="btn-group" role="group">
              <Button variant="outline-secondary" size="sm" onClick={zoomOut}>
                🔍-
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={resetZoom}>
                {Math.round(scale * 100)}%
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={zoomIn}>
                🔍+
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "🗗" : "🗖"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pdf-reader-content d-flex">
        {/* Side Navigation Panel */}
        <div
          className="pdf-sidebar bg-light border-end"
          style={{
            width: "250px",
            height: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div className="p-3">
            <h6 className="bengali-text mb-3">পৃষ্ঠা নেভিগেশন</h6>

            {/* Quick Navigation */}
            <div className="mb-3">
              <div className="d-grid gap-1">
                <Button
                  variant={currentPage === 1 ? "danger" : "outline-secondary"}
                  size="sm"
                  onClick={() => goToPage(1)}
                  className="bengali-text"
                >
                  প্রথম পৃষ্ঠা
                </Button>
                <Button
                  variant={
                    currentPage === numPages ? "danger" : "outline-secondary"
                  }
                  size="sm"
                  onClick={() => goToPage(numPages)}
                  className="bengali-text"
                >
                  শেষ পৃষ্ঠা
                </Button>
              </div>
            </div>

            {/* Page List */}
            <div className="page-list">
              <h6 className="bengali-text small mb-2">পৃষ্ঠা তালিকা</h6>
              {generatePageList().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={
                    pageNum === currentPage ? "danger" : "outline-secondary"
                  }
                  size="sm"
                  className="me-1 mb-1"
                  onClick={() => goToPage(pageNum)}
                  style={{ width: "40px" }}
                >
                  {pageNum}
                </Button>
              ))}

              {currentPage > 6 && (
                <div className="text-center mt-2">
                  <small className="text-muted">...</small>
                </div>
              )}
            </div>

            {/* PDF Info */}
            <div className="mt-4 pt-3 border-top">
              <small className="text-muted bengali-text">
                <div>মোট পৃষ্ঠা: {numPages}</div>
                <div>বর্তমান: {currentPage}</div>
                <div>জুম: {Math.round(scale * 100)}%</div>
              </small>
            </div>
          </div>
        </div>

        {/* Main PDF Display Area */}
        <div
          className="pdf-main-content flex-grow-1 bg-gray-100 d-flex justify-content-center align-items-start p-3"
          style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          <div className="pdf-page-container">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="text-center py-5">
                  <Spinner animation="border" variant="danger" />
                  <p className="mt-2 bengali-text">PDF লোড হচ্ছে...</p>
                </div>
              }
              error={
                <div className="text-center py-5">
                  <Alert variant="danger" className="bengali-text">
                    PDF লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।
                  </Alert>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="pdf-page shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="pdf-reader-hint bengali-text">
        <div>⌨️ কীবোর্ড শর্টকাট:</div>
        <div>← → তীর কী: পৃষ্ঠা পরিবর্তন</div>
        <div>Home/End: প্রথম/শেষ পৃষ্ঠা</div>
      </div>
    </div>
  );
};

export default PDFReader;

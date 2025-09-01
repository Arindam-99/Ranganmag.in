import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, Button, Row, Col, Alert, Spinner } from "react-bootstrap";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ArticlePDFViewer = ({ article }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("PDF loaded successfully:", {
      numPages,
      pdfUrl: article.pdfUrl,
    });
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error, { pdfUrl: article.pdfUrl });
    setError(`PDF লোড করতে সমস্যা হয়েছে: ${error.message || error}`);
    setLoading(false);
  };

  // Generate page cards (current page + next 5 pages)
  const generatePageCards = () => {
    const cards = [];
    const startPage = currentPage + 1;
    const endPage = Math.min(startPage + 4, numPages); // Show next 5 pages max

    for (let i = startPage; i <= endPage; i++) {
      cards.push(i);
    }
    return cards;
  };

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!article || !article.pdfUrl) {
    console.log("ArticlePDFViewer: No article or PDF URL", { article });
    return (
      <div className="alert alert-warning">
        <p>Debug: ArticlePDFViewer - No article or PDF URL</p>
        <p>Article: {article ? "exists" : "null"}</p>
        <p>PDF URL: {article?.pdfUrl || "none"}</p>
      </div>
    );
  }

  console.log("ArticlePDFViewer: Rendering PDF", {
    article,
    pdfUrl: article.pdfUrl,
  });

  if (loading) {
    return (
      <div className="pdf-article-viewer">
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3 bengali-text">PDF লোড হচ্ছে...</p>
          <p className="small text-muted">
            Loading: {`http://localhost:5000${article.pdfUrl}`}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-article-viewer">
        <Alert variant="danger" className="bengali-text">
          <p>Error: {error}</p>
          <p className="small">
            PDF URL: {`http://localhost:5000${article.pdfUrl}`}
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="pdf-article-viewer">
      {/* Article Header */}
      <div className="article-header mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h1 className="newspaper-headline bengali-text mb-2">
              {article.title}
            </h1>
            {article.subtitle && (
              <h2 className="newspaper-subheadline bengali-text text-muted mb-3">
                {article.subtitle}
              </h2>
            )}
          </div>
          <div className="article-controls">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setScale(scale > 0.5 ? scale - 0.1 : scale)}
              className="me-1"
            >
              🔍-
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setScale(scale < 2.0 ? scale + 0.1 : scale)}
              className="me-1"
            >
              🔍+
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setScale(1.0)}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="article-meta border-top border-bottom py-2">
          <Row>
            <Col md={6}>
              <small className="bengali-text text-muted">
                <strong>লেখক:</strong> {article.author}
              </small>
            </Col>
            <Col md={6} className="text-md-end">
              <small className="bengali-text text-muted">
                <strong>পৃষ্ঠা:</strong> {currentPage} / {numPages}
              </small>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main PDF Display Area */}
      <div className="main-pdf-display mb-4">
        <div className="pdf-page-container text-center">
          <Document
            file={`http://localhost:5000${article.pdfUrl}`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2 bengali-text">PDF লোড হচ্ছে...</p>
              </div>
            }
            error={
              <Alert variant="danger" className="bengali-text">
                PDF লোড করতে সমস্যা হয়েছে।
              </Alert>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="pdf-main-page shadow-lg mx-auto"
            />
          </Document>
        </div>
      </div>

      {/* Page Navigation Cards */}
      {numPages > 1 && (
        <div className="page-navigation-cards">
          <h5 className="bengali-text mb-3">পরবর্তী পৃষ্ঠাসমূহ</h5>
          <Row>
            {generatePageCards().map((pageNum) => (
              <Col key={pageNum} xs={6} sm={4} md={2} className="mb-3">
                <Card
                  className="page-card h-100 cursor-pointer"
                  onClick={() => goToPage(pageNum)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="p-2 text-center">
                    <div className="page-preview mb-2">
                      <Document
                        file={`http://localhost:5000${article.pdfUrl}`}
                        loading={<div className="small">লোড হচ্ছে...</div>}
                        error={<div className="small text-muted">Error</div>}
                      >
                        <Page
                          pageNumber={pageNum}
                          scale={0.2}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="page-thumbnail"
                        />
                      </Document>
                    </div>
                    <small className="bengali-text">পৃষ্ঠা {pageNum}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Navigation Buttons */}
          <div className="navigation-buttons text-center mt-4">
            <Button
              variant="outline-danger"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="me-2 bengali-text"
            >
              ← পূর্ববর্তী
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= numPages}
              className="bengali-text"
            >
              পরবর্তী →
            </Button>
          </div>
        </div>
      )}

      {/* Article Footer */}
      <div className="article-footer mt-5 pt-4 border-top">
        <Row>
          <Col md={6}>
            <small className="bengali-text text-muted">
              প্রকাশিত: {new Date(article.date).toLocaleDateString("bn-BD")}
            </small>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="bengali-text text-muted">
              বিভাগ: {article.category}
            </small>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ArticlePDFViewer;

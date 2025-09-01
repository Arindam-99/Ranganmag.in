import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const IframePDFViewer = ({ article }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(50); // Default estimate for large PDFs

  if (!article || !article.pdfUrl) {
    return (
      <div className="alert alert-warning">
        <p>No PDF article available</p>
      </div>
    );
  }

  // Generate page cards (current page + next 5 pages)
  const generatePageCards = () => {
    const cards = [];
    const startPage = currentPage + 1;
    const endPage = Math.min(startPage + 4, totalPages); // Show next 5 pages max

    for (let i = startPage; i <= endPage; i++) {
      cards.push(i);
    }
    return cards;
  };

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pdfUrl = `http://localhost:5000${article.pdfUrl}`;

  return (
    <div className="iframe-pdf-viewer">
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
                <strong>পৃষ্ঠা:</strong> {currentPage} / {totalPages}
              </small>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main PDF Display Area */}
      <div className="main-pdf-display mb-4">
        <div className="pdf-iframe-container">
          <iframe
            src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=0&scrollbar=1`}
            width="100%"
            height="800px"
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            title={`${article.title} - Page ${currentPage}`}
          >
            <p className="bengali-text text-center p-4">
              আপনার ব্রাউজার PDF প্রদর্শন সমর্থন করে না।
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary ms-2"
              >
                এখানে ক্লিক করে PDF দেখুন
              </a>
            </p>
          </iframe>
        </div>
      </div>

      {/* Page Navigation Cards */}
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
                  <div
                    className="page-preview mb-2"
                    style={{
                      height: "120px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center">
                      <div className="h1 text-muted">{pageNum}</div>
                      <small className="text-muted">পৃষ্ঠা</small>
                    </div>
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
            variant="outline-secondary"
            onClick={() => goToPage(1)}
            disabled={currentPage <= 1}
            className="me-2 bengali-text"
            size="sm"
          >
            প্রথম পৃষ্ঠা
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="me-2 bengali-text"
          >
            ← পূর্ববর্তী
          </Button>
          <span className="mx-3 bengali-text">
            পৃষ্ঠা {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline-danger"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="me-2 bengali-text"
          >
            পরবর্তী →
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="bengali-text"
            size="sm"
          >
            শেষ পৃষ্ঠা
          </Button>
        </div>
      </div>

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

export default IframePDFViewer;

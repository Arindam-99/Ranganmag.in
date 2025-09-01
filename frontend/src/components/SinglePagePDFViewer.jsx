import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const SinglePagePDFViewer = ({ article }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!article || !article.pdfUrl) {
    return (
      <div className="alert alert-warning">
        <p className="bengali-text">কোন PDF নিবন্ধ পাওয়া যায়নি</p>
      </div>
    );
  }

  const pdfUrl = `http://localhost:5000${article.pdfUrl}`;

  return (
    <div className="single-page-pdf-viewer">
      {/* Article Header */}
      <div className="article-header mb-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-danger bengali-text mb-2">
                  📄 PDF নিবন্ধ
                </span>
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
            
            <div className="article-meta border-top pt-3">
              <Row>
                <Col md={6}>
                  <small className="bengali-text text-muted">
                    <strong>লেখক:</strong> {article.author}
                  </small>
                </Col>
                <Col md={6} className="text-md-end">
                  <small className="bengali-text text-muted">
                    <strong>তারিখ:</strong> {new Date(article.date).toLocaleDateString("bn-BD")}
                  </small>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Single Page PDF Display */}
      <div className="pdf-display-area mb-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="pdf-controls bg-light p-3 border-bottom">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                    >
                      ← পূর্ববর্তী
                    </Button>
                    <span className="bengali-text mx-2">
                      পৃষ্ঠা {currentPage}
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      পরবর্তী →
                    </Button>
                  </div>
                </Col>
                <Col md={6} className="text-md-end">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-success bengali-text"
                  >
                    📥 PDF ডাউনলোড
                  </a>
                </Col>
              </Row>
            </div>

            {/* Main PDF Iframe - Single Page Display */}
            <div className="pdf-iframe-container">
              <iframe
                src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit`}
                width="100%"
                height="800px"
                style={{ 
                  border: 'none',
                  display: 'block'
                }}
                title={`${article.title} - পৃষ্ঠা ${currentPage}`}
              >
                <div className="text-center p-4">
                  <p className="bengali-text text-muted">
                    আপনার ব্রাউজার PDF প্রদর্শন সমর্থন করে না।
                  </p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary bengali-text"
                  >
                    PDF খুলুন
                  </a>
                </div>
              </iframe>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Page Navigation */}
      <div className="quick-navigation">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-3">
            <h6 className="bengali-text mb-3">দ্রুত নেভিগেশন</h6>
            <div className="d-flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="bengali-text"
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            
            <div className="mt-3">
              <div className="input-group input-group-sm" style={{ maxWidth: '200px' }}>
                <span className="input-group-text bengali-text">পৃষ্ঠা</span>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1) {
                      setCurrentPage(page);
                    }
                  }}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {/* Page will update automatically */}}
                >
                  যান
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Article Footer */}
      <div className="article-footer mt-4 pt-4 border-top">
        <Row>
          <Col md={6}>
            <small className="bengali-text text-muted">
              বিভাগ: {article.category}
            </small>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="bengali-text text-muted">
              প্রকাশিত: {new Date(article.createdAt).toLocaleDateString("bn-BD")}
            </small>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SinglePagePDFViewer;

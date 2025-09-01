import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ArchiveSection = () => {
  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="archive-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <span className="bengali-text">
              <strong>আজকের তারিখ:</strong> {currentDate}
            </span>
          </Col>
          <Col md={6} className="text-md-end">
            <span className="bengali-text">
              <strong>আর্কাইভ:</strong> 
              <a href="#" className="text-white ms-2">গত সংখ্যা</a> |
              <a href="#" className="text-white ms-2">পুরাতন সংখ্যা</a>
            </span>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArchiveSection;

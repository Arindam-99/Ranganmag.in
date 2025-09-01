import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="bengali-text">রাঙ্গামাগ</h5>
            <p className="bengali-text mb-0">
              আধুনিক বাংলা সংবাদপত্র - সত্য ও নিরপেক্ষ সংবাদের জন্য
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              © {currentYear} Ranganmag. All rights reserved.
            </p>
            <p className="mb-0">
              <small>Developed with React.js & Node.js</small>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

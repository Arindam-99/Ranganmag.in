import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Header = () => {
  return (
    <header className="site-header">
      <Container>
        <Row>
          <Col>
            <h1 className="site-title bengali-text">রাঙ্গামাগ</h1>
            <p className="text-center mb-0" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
              আধুনিক সংবাদপত্র
            </p>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;

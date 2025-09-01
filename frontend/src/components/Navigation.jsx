import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = () => {
  return (
    <Navbar className="main-nav" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <LinkContainer to="/">
              <Nav.Link className="bengali-text">প্রচ্ছদ</Nav.Link>
            </LinkContainer>
            <Nav.Link href="#" className="bengali-text">জাতীয়</Nav.Link>
            <Nav.Link href="#" className="bengali-text">আন্তর্জাতিক</Nav.Link>
            <Nav.Link href="#" className="bengali-text">অর্থনীতি</Nav.Link>
            <Nav.Link href="#" className="bengali-text">খেলা</Nav.Link>
            <Nav.Link href="#" className="bengali-text">বিনোদন</Nav.Link>
            <Nav.Link href="#" className="bengali-text">প্রযুক্তি</Nav.Link>
            <Nav.Link href="#" className="bengali-text">মতামত</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

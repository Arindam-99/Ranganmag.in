import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <Navbar className="admin-header" expand="lg">
      <Container>
        <Navbar.Brand>
          <h1 className="admin-title mb-0">
            📰 Ranganmag Admin
          </h1>
          <small className="d-block opacity-75">Blogger Upload Interface</small>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/upload">
              <Nav.Link>Upload Article</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/articles">
              <Nav.Link>Manage Articles</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

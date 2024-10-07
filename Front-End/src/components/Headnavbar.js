import React, { useState } from "react";
import "../App.css";
import { Navbar, Container, Offcanvas, Nav } from "react-bootstrap";

function HeadNavbar({ logo, brandName }) {
  const [show, setShow] = useState(false); // Offcanvas 표시 상태를 관리하는 state

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar expand="lg" className="navhead">
      <Container className="navContainer">
        <div className="navLogo">
          <img
            src={logo}
            width="80"
            height="80"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          <Navbar.Brand
            href="#home"
            style={{ color: "white", fontSize: "50px", fontWeight: "bold" }}>
            {brandName}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
      </Container>

      <Offcanvas
        style={{ fontSize: "1.5em" }}
        show={show}
        onHide={handleClose}
        placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title
            style={{ fontWeight: "bold", fontSize: "1.2em", color: "black" }}>
            Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link
              style={{ display: "flex", alignItems: "center" }}
              href="https://hana-fe-team1.github.io/HomeInOne/">
              HomeInOne
              <span
                style={{ paddingLeft: "5px", fontSize: "1.1em" }}
                className="material-symbols-outlined">
                house
              </span>
            </Nav.Link>
            <Nav.Link
              style={{ display: "flex", alignItems: "center" }}
              href="#features">
              Features
              <span
                style={{ paddingLeft: "5px" }}
                className="material-symbols-outlined">
                featured_seasonal_and_gifts
              </span>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default HeadNavbar;

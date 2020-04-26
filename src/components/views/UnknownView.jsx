/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";

class UnknownView extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Row>
          <Link to="/" className="d-block ml-auto mr-auto mb-4">
            <img src={logoLine} alt="logo" height="128" />
          </Link>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <h2>Ooops ! this page doesn&#39;t exist !</h2>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/" className="btn btn-secondary">
                Go back to homepage
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default UnknownView;

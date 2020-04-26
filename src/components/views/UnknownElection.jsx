/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { withTranslation } from "react-i18next";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";

class UnknownElection extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    return (
      <Container>
        <Row>
          <Link to="/" className="d-block ml-auto mr-auto mb-4">
            <img src={logoLine} alt="logo" height="128" />
          </Link>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <h2>
              {t(
                "Oops! This election does not exist or it is not available anymore."
              )}
            </h2>
            <p>{t("You can start another election.")}</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/" className="btn btn-secondary">
              {t("Go back to homepage")}
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withTranslation()(UnknownElection);

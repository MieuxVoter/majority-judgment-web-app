/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { withTranslation } from "react-i18next";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Paypal from "../banner/Paypal";

class VoteSuccess extends Component {
  static contextType = AppContext;
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
          <Col className="text-center offset-lg-3" lg="6">
            <h2>{t("Your participation was recorded with success!")}</h2>
            <p>{t("Thanks for your participation.")}</p>
            <div className="mt-3">
              <Paypal btnColor="btn-success" />
            </div>
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
export default withTranslation()(VoteSuccess);

import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { withTranslation } from "react-i18next";

class LegalNotices extends Component {
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
            <h1>{t("Legal notices")}</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h3 className="bold">Editeur du Site</h3>
            <p>
              Association MIEUX VOTER
              <br />
              59 Rue Saint-André des Arts, 75006 Paris
            </p>
            <p>
              <a
                href="https://mieuxvoter.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                https://mieuxvoter.fr/
              </a>
            </p>
            <h3 className="mt-2 bold">Hébergement</h3>
            <p>
              Association MIEUX VOTER
              <br />
              59 Rue Saint-André des Arts, 75006 Paris
            </p>
            <p>
              <a
                href="https://mieuxvoter.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                https://mieuxvoter.fr/
              </a>
            </p>
            <h3 className="mt-2 bold">Développement</h3>
            <p>
              Association MIEUX VOTER
              <br />
              59 Rue Saint-André des Arts, 75006 Paris
            </p>
            <p>
              <a
                href="https://mieuxvoter.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                https://mieuxvoter.fr/
              </a>
            </p>
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
export default withTranslation()(LegalNotices);

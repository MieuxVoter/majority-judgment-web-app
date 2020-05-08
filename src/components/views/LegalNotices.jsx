/* eslint react/prop-types: 0 */
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
                        <h3 className="bold">Editeur</h3>
                        <p>Cette Application est éditée par l’association loi 1901
                            {" "}<a
                                href="https://mieuxvoter.fr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white"
                            >
                                “Mieux Voter”
                            </a>, dont le siège social est situé au 59 rue Saint-André des Arts, à Paris (75006).</p>

                        <p>
                            Adresse email : 
                            <a href="mailto:contact@mieuxvoter.fr" className="text-light">
                                contact@mieuxvoter.fr
                            </a>
                        </p>
                        <p>
                            <b>Directeur de la publication</b>
                            <br />Chloé Ridel
                        </p>
                        <h3 className="mt-2 bold">Hébergement</h3>
                        <p>
                            <ul>
                                <li>Base de données : Institut Systèmes Complexes, Paris ;</li>
                                <li>Fichiers statiques : Netlify, 2325 3rd Street, Suite 215, San Francisco, California 94107.</li>
                            </ul>
                        </p>
                        <h3 className="mt-2 bold">&OElig;uvres graphiques</h3>
                        <p>
                            Les illustrations et graphismes sur cette application sont l’&oelig;uvre de l’association Mieux Voter.
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

/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { withTranslation } from "react-i18next";

class Faq extends Component {
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
                        <h1>{t("FAQ")}</h1>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Suspendisse tristique eros dictum, tempor libero quis, tincidunt
                            velit. Vestibulum non diam rutrum nisl consequat pulvinar.
                            Phasellus fermentum, massa at pulvinar eleifend, tellus nibh
                            dictum nulla, et gravida lectus lacus a mauris. Nunc a augue eget
                            risus commodo blandit.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Suspendisse tristique eros dictum, tempor libero quis, tincidunt
                            velit. Vestibulum non diam rutrum nisl consequat pulvinar.
                            Phasellus fermentum, massa at pulvinar eleifend, tellus nibh
                            dictum nulla, et gravida lectus lacus a mauris. Nunc a augue eget
                            risus commodo blandit.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Suspendisse tristique eros dictum, tempor libero quis, tincidunt
                            velit. Vestibulum non diam rutrum nisl consequat pulvinar.
                            Phasellus fermentum, massa at pulvinar eleifend, tellus nibh
                            dictum nulla, et gravida lectus lacus a mauris. Nunc a augue eget
                            risus commodo blandit.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Suspendisse tristique eros dictum, tempor libero quis, tincidunt
                            velit. Vestibulum non diam rutrum nisl consequat pulvinar.
                            Phasellus fermentum, massa at pulvinar eleifend, tellus nibh
                            dictum nulla, et gravida lectus lacus a mauris. Nunc a augue eget
                            risus commodo blandit.
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

export default withTranslation()(Faq);
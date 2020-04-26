/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Container, Row, Col, Button, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import logoLine from "../../logos/logo-line-white.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      redirect: false
    };
    this.focusInput = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ redirect: true });
  };

  handleChangeTitle = event => {
    //console.log(this.context.routesServer.setElection);
    this.setState({ title: event.target.value });
  };

  render() {
    const { t } = this.props;
    const redirect = this.state.redirect;

    if (redirect) {
      return (
        <Redirect
          to={"/create-election/?title=" + encodeURIComponent(this.state.title)}
        />
      );
    }
    return (
      <Container>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <img
              src={logoLine}
              alt="logo"
              height="128"
              className="d-block ml-auto mr-auto mb-4"
            />
          </Row>
          <Row>
            <Col className="text-center">
              <h3>
                {t(
                  "Simple and free: organize an election with Majority Judgment."
                )}
              </h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs="12" md="9" xl="6" className="offset-xl-2">
              <Input
                placeholder={t("Write here the question of your election")}
                innerRef={this.focusInput}
                autoFocus
                required
                className="mt-2"
                name="title"
                value={this.state.title ? this.state.title : ""}
                onChange={this.handleChangeTitle}
                maxLength="250"
              />
            </Col>
            <Col xs="12" md="3" xl="2">
              <Button
                type="submit"
                className="btn btn-block btn-secondary mt-2"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                {t("Start")}
              </Button>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <p>{t("No advertising or ad cookies")}</p>
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
}
export default withTranslation()(Home);

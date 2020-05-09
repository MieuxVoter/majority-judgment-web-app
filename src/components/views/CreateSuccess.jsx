/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  faCopy,
  faVoteYea,
  faExclamationTriangle,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppContext } from "../../AppContext";
import CopyField from "../CopyField";
import Facebook from "../banner/Facebook";

class CreateSuccess extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    const electionSlug = this.props.match.params.slug;
    this.state = {
      urlOfVote: window.location.origin + "/vote/" + electionSlug,
      urlOfResult: window.location.origin + "/result/" + electionSlug
    };
    this.urlVoteField = React.createRef();
    this.urlResultField = React.createRef();
  }

  handleClickOnCopyResult = () => {
    const input = this.urlResultField.current;
    input.focus();
    input.select();
    document.execCommand("copy");
  };

  render() {
    const { t } = this.props;
    const electionLink = this.props.invitationOnly ? (
      <>
        <p className="mb-1">
          {t(
            "Voters received a link to vote by email. Each link can be used only once!"
          )}
        </p>
      </>
    ) : (
      <>
        <p className="mb-1">{t("Voting address")}</p>
        <CopyField
          value={this.state.urlOfVote}
          iconCopy={faCopy}
          iconOpen={faExternalLinkAlt}
          t={t}
        />
      </>
    );
    return (
      <Container>
        <Row className="mt-5">
          <Col className="text-center offset-lg-3" lg="6">
            <h2>{t("Successful election creation!")}</h2>
            {this.props.invitationOnly ? null : (
              <Facebook
                className="btn btn-sm btn-outline-light  m-2"
                text={t("Share election on Facebook")}
                url={this.state.urlOfVote}
                title={"app.mieuxvoter.fr"}
              />
            )}
          </Col>
        </Row>
        <Row className="mt-5 mb-4">
          <Col className="offset-lg-3" lg="6">
            <h5 className="mb-3 text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              {t("Keep these links carefully")}
            </h5>
            <div className="border rounded p-4 pb-5">
              {electionLink}

              <p className="mt-4 mb-1">{t("Results address")}</p>
              <CopyField
                value={this.state.urlOfResult}
                iconCopy={faCopy}
                iconOpen={faExternalLinkAlt}
                t={t}
              />
            </div>

            {/*<div className="input-group  ">
              <input
                type="text"
                className="form-control"
                value=""
                placeholder="email@domaine.com"
              />
              <div className="input-group-append">
                <a
                  className="btn btn-success"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  {this.props.invitationOnly
                    ? t("Send me this link")
                    : t("Send me these links")}
                </a>
              </div>
            </div>*/}
            {/*<div className="text-center">
                <button
                    type="button"
                    className="btn btn-success  m-2"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  {(this.props.invitationOnly?t("Send me this link by email"):t("Send me these links by email"))}
                </button>

              </div>*/}
          </Col>
        </Row>
        {this.props.invitationOnly ? null : (
          <Row className="mt-4 mb-4">
            <Col className="text-center">
              <Link
                to={"/vote/" + this.props.match.params.slug}
                className="btn btn-secondary"
              >
                <FontAwesomeIcon icon={faVoteYea} className="mr-2" />
                {t("Participate now!")}
              </Link>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
export default withTranslation()(CreateSuccess);

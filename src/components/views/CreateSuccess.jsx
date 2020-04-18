import React, {Component} from 'react';
import {Button, Col, Container, Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {withTranslation, Trans} from 'react-i18next';
import {faCopy, faUsers, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import logoLine from '../../logos/logo-line-white.svg';
import {AppContext} from '../../AppContext';

class CreateSuccess extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    const electionSlug = this.props.match.params.slug;
    this.state = {
      urlOfVote:
          window.location.origin + '/vote/' + electionSlug,
      urlOfResult:
          window.location.origin + '/result/' + electionSlug,
    };
    this.urlVoteField = React.createRef();
    this.urlResultField = React.createRef();
  }

  handleClickOnField = event => {
    event.target.focus();
    event.target.select();
  };

  handleClickOnCopyVote = event => {
    const input = this.urlVoteField.current;
    input.focus();
    input.select();
    document.execCommand('copy');
  };

  handleClickOnCopyResult = event => {
    const input = this.urlResultField.current;
    input.focus();
    input.select();
    document.execCommand('copy');
  };

  render() {
    const {t} = this.props;
    return (
      <Container>
        <Row>
          <Link to="/" className="d-block ml-auto mr-auto mb-4">
            <img src={logoLine} alt="logo" height="128" />
          </Link>
        </Row>
        <Row className="mt-4">
          <Col className="text-center offset-lg-3" lg="6">
            <h2>{t('Successful election creation!')}</h2>
            <p className="mt-4 mb-1">
              {t('You can now share the election link to participants:')}
            </p>

            <div className="input-group  ">
              <input
                type="text"
                className="form-control"
                ref={this.urlVoteField}
                value={this.state.urlOfVote}
                readOnly
                onClick={this.handleClickOnField}
              />

              <div className="input-group-append">
                <Button
                  className="btn btn-outline-light"
                  onClick={this.handleClickOnCopyVote}
                  type="button">
                  <FontAwesomeIcon icon={faCopy} className="mr-2" />
                  {t('Copy')}
                </Button>
              </div>
            </div>

            <p className="mt-4 mb-1">
              {t('Here is the link for the results in real time:')}
            </p>
            <div className="input-group ">
              <input
                type="text"
                className="form-control"
                ref={this.urlResultField}
                value={this.state.urlOfResult}
                readOnly
                onClick={this.handleClickOnField}
              />

              <div className="input-group-append">
                <Button
                  className="btn btn-outline-light"
                  onClick={this.handleClickOnCopyResult}
                  type="button">
                  <FontAwesomeIcon icon={faCopy} className="mr-2" />
                  {t('Copy')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col className="text-center offset-lg-3" lg="6">
            <div className=" bg-danger text-white p-2 ">
              <h4 className="m-0 p-0 text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                 {t('Keep these links carefully')}
              </h4>
              <p className="small m-2 p-0">
                <Trans i18nKey="t">
                  <b>Warning</b>: you will have no other choices to recover the
                  links, and we will not be able to share them with you. For
                  example, you can bookmark them in your browser.
                </Trans>
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col className="text-center">
            <Link
              to={'/vote/' + this.props.match.params.slug}
              className="btn btn-success">
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
		      {t("Participate now!")}
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withTranslation()(CreateSuccess);

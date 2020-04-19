import React, {Component} from 'react';
import {Button, Col, Container, Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {withTranslation, Trans} from 'react-i18next';
import {faCopy, faUsers} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import logoLine from '../../logos/logo-line-white.svg';
import {AppContext} from '../../AppContext';
import CopyField from '../CopyField';




class CreateSuccess extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    console.log(props);
    const electionSlug = this.props.match.params.slug;
    this.state = {
      urlOfVote: `https://${window.location.hostname}/vote/${electionSlug}`,
      urlOfResult: `https://${window.location.hostname}/result/${electionSlug}`,
    };
    this.urlVoteField = React.createRef();
    this.urlResultField = React.createRef();
  }

  handleClickOnCopyResult = event => {
    const input = this.urlResultField.current;
    input.focus();
    input.select();
    document.execCommand('copy');
  };

  render() {
    const {t} = this.props;
    console.log(this.props)
    const electionLink = this.props.invitationOnly ? (
      <>
        <p className="mt-4 mb-1">
          {t('Voters received a link to vote by email. Each link can be used only once!')}
        </p>
      </>
    ) : (
      <>
        <p className="mt-4 mb-1">
          {t('You can now share the election link to participants:')}
        </p>
        <CopyField
          value={this.state.urlOfVote}
          icon={faCopy}
          t={t}
        />
      </>
    );

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

            {electionLink}

            <p className="mt-4 mb-1">
              {t('Here is the link for the results in real time:')}
            </p>
            <CopyField
              value={this.state.urlOfResult}
              icon={faCopy}
              t={t}
            />
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col>
            <div className=" bg-warning text-white p-2 ">
              <p className="m-0 p-0 text-center">
                {t('Keep these links carefully')}
              </p>
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
              {t('Participate now!')}
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withTranslation()(CreateSuccess);

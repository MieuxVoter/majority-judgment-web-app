import React, {Component} from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {
  Collapse,
  Container,
  Row,
  Col,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Button,
  Card,
  CardBody,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {resolve} from 'url';
import queryString from 'query-string';
import HelpButton from '../form/HelpButton';
import {
  arrayMove,
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import ButtonWithConfirm from '../form/ButtonWithConfirm';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrashAlt,
  faCheck,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';

import {i18nGrades} from '../../Util';
import {ReactMultiEmail, isEmail} from 'react-multi-email';
import 'react-multi-email/style.css';
import {AppContext} from '../../AppContext';

// Convert a Date object into YYYY-MM-DD
const dateToISO = date => date.toISOString().substring(0, 10);

// Retrieve the current hour, minute, sec, ms, time into a timestamp
const hours = date => date.getHours() * 3600 * 1000;
const minutes = date => date.getMinutes() * 60 * 1000;
const seconds = date => date.getSeconds() * 1000;
const ms = date => date.getMilliseconds();
const time = date => hours(date) + minutes(date) + seconds(date) + ms(date);

// Retrieve the time part from a timestamp and remove the day. Return a int.
const timeMinusDate = date => time(date);

// Retrieve the day and remove the time. Return a Date
const dateMinusTime = date => new Date(date.getTime() - time(date));

const DragHandle = sortableHandle(({children}) => (
  <span className="input-group-text indexNumber">{children}</span>
));

const SortableCandidate = sortableElement(({candidate, sortIndex, form, t}) => (
  <li className="sortable">
    <Row key={'rowCandidate' + sortIndex}>
      <Col>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <DragHandle>
              <span>{sortIndex + 1}</span>
            </DragHandle>
          </InputGroupAddon>
          <Input
            type="text"
            value={candidate.label}
            onChange={event => form.editCandidateLabel(event, sortIndex)}
            onKeyPress={event =>
              form.handleKeypressOnCandidateLabel(event, sortIndex)
            }
		  placeholder={t("Candidate/proposal name...")}
            tabIndex={sortIndex + 1}
            innerRef={ref => (form.candidateInputs[sortIndex] = ref)}
            maxLength="250"
          />
          <ButtonWithConfirm className="btn btn-primary input-group-append border-light">
            <div key="button">
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
            <div key="modal-title">{t("Delete?")}</div>
            <div key="modal-body">
		{t("Are you sure to delete")}
              {' '}
              {candidate.label !== '' ? (
                <b>"{candidate.label}"</b>
              ) : (
                <span>{t("the row")} {sortIndex + 1}</span>
              )}{' '}
              ?
            </div>
            <div
              key="modal-confirm"
              onClick={() => form.removeCandidate(sortIndex)}>
              Oui
            </div>
            <div key="modal-cancel">Non</div>
          </ButtonWithConfirm>
        </InputGroup>
      </Col>
      <Col xs="auto" className="align-self-center pl-0">
        <HelpButton>
		{t("Write here your question or introduce simple your election (250 characters max.)")}
        </HelpButton>
      </Col>
    </Row>
  </li>
));

const SortableCandidatesContainer = sortableContainer(({items, form, t}) => {
  return (
    <ul className="sortable">
      {items.map((candidate, index) => (
        <SortableCandidate
          key={`item-${index}`}
          index={index}
          sortIndex={index}
          candidate={candidate}
          form={form}
	  t={t}
        />
      ))}
    </ul>
  );
});

class CreateElection extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    // default value : start at the last hour
    const now = new Date();
    const start = new Date(now.getTime() - minutes(now) - seconds(now) - ms(now));
    const {title} = queryString.parse(this.props.location.search);

    this.state = {
      candidates: [{label: ''}, {label: ''}],
      numCandidatesWithLabel: 0,
      title: title || '',
      isVisibleTipsDragAndDropCandidate: true,
      numGrades: 7,
      successCreate: false,
      redirectTo: null,
      isAdvancedOptionsOpen: false,
      start,
      // by default, the election ends in a week
      finish: new Date(start.getTime() + 7 * 24 * 3600 * 1000),
      electorEmails: [],
    };
    this.candidateInputs = [];
    this.focusInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeTitle = event => {
    this.setState({title: event.target.value});
  };

  addCandidate = event => {
    let candidates = this.state.candidates;
    if (candidates.length < 100) {
      candidates.push({label: ''});
      this.setState({candidates: candidates});
    }
    if (event.type === 'keypress') {
      setTimeout(() => {
        this.candidateInputs[this.state.candidates.length - 1].focus();
      }, 250);
    }
  };

  removeCandidate = index => {
    let candidates = this.state.candidates;
    candidates.splice(index, 1);
    if (candidates.length === 0) {
      candidates = [{label: ''}];
    }
    this.setState({candidates: candidates});
  };

  editCandidateLabel = (event, index) => {
    let candidates = this.state.candidates;
    let numLabels = 0;
    candidates[index].label = event.currentTarget.value;
    candidates.map((candidate, i) => {
      if (candidate.label !== '') {
        numLabels++;
      }
      return candidate.label;
    });
    this.setState({
      candidates: candidates,
      numCandidatesWithLabel: numLabels,
    });
  };

  handleKeypressOnCandidateLabel = (event, index) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (index + 1 === this.state.candidates.length) {
        this.addCandidate(event);
      } else {
        this.candidateInputs[index + 1].focus();
      }
    }
  };

  onCandidatesSortEnd = ({oldIndex, newIndex}) => {
    let candidates = this.state.candidates;
    candidates = arrayMove(candidates, oldIndex, newIndex);
    this.setState({candidates: candidates});
  };

  handleChangeNumGrades = event => {
    this.setState({numGrades: event.target.value});
  };

  toggleAdvancedOptions = () => {
    this.setState({isAdvancedOptionsOpen: !this.state.isAdvancedOptionsOpen});
  };

  handleSubmit() {
    const {candidates, title, numGrades, start, finish} = this.state;

    const endpoint = resolve(
      this.context.urlServer,
      this.context.routesServer.setElection,
    );

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        candidates: candidates.map(c => c.label),
        on_invitation_only: this.state.electorEmails.length > 0,
        num_grades: numGrades,
        elector_emails: this.state.electorEmails,
        start_at: start.getTime() / 1000,
        finish_at: finish.getTime() / 1000,
      }),
    })
      .then(response => response.json())
      .then(result =>
        this.setState(state => ({
          redirectTo: '/create-success/' + result.id,
          successCreate: true,
        })),
      )
      .catch(error => error);
  }

  handleSendWithoutCandidate = () => {
    const {t} = this.props;
    toast.error(t("Please add at least 2 candidates."), {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  render() {
    const {successCreate, redirectTo} = this.state;
    const {electorEmails} = this.state;
    const {t} = this.props;

    const grades = i18nGrades();

    if (successCreate) return <Redirect to={redirectTo} />;

    return (
      <Container>
        <ToastContainer />
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <Col>
              <h3>{t("Start an election")}</h3>
            </Col>
          </Row>
          <hr />
          <Row className="mt-4">
            <Col xs="12">
              <Label for="title">{t("Question of the election")}</Label>
            </Col>
            <Col>
              <Input
                placeholder={t("Write here the question of your election")}
                tabIndex="1"
                name="title"
                id="title"
                innerRef={this.focusInput}
                autoFocus
                value={this.state.title}
                onChange={this.handleChangeTitle}
                maxLength="250"
              />
            </Col>
            <Col xs="auto" className="align-self-center pl-0">
              <HelpButton>
		{t("Write here your question or introduce simple your election (250 characters max.)")}
                <br />
			<u>{t("For example:")}</u>{' '}
                <em>{t("For the role of my representative, I judge this candidate...")}</em>
              </HelpButton>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="12">
		    <Label for="title">{t("Candidates/Proposals")}</Label>
            </Col>
            <Col xs="12">
              <SortableCandidatesContainer
                items={this.state.candidates}
                onSortEnd={this.onCandidatesSortEnd}
                form={this}
                t={t}
                useDragHandle
              />
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col xs="12" sm="6" md="5" lg="4">
              <Button
                color="secondary"
                className="btn-block mt-2"
                tabIndex={this.state.candidates.length + 2}
                type="button"
                onClick={event => this.addCandidate(event)}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
			{t("Add a proposal")}
              </Button>
            </Col>
            <Col
              xs="12"
              sm="6"
              md="12"
              className="text-center text-sm-right text-md-left">
              <Button
                color="link"
                className="text-white mt-3 mb-1"
                onClick={this.toggleAdvancedOptions}>
                <FontAwesomeIcon icon={faCogs} className="mr-2" />
			{t("Advanced options")}
              </Button>
            </Col>
          </Row>
          <Collapse isOpen={this.state.isAdvancedOptionsOpen}>
            <Card>
              <CardBody className="text-primary">
                <Row>
                  <Col xs="12" md="3" lg="2">
			  <Label for="title">{t("Starting date:")}</Label>
                  </Col>
                  <Col xs="6" md="4" lg="3">
                    <input
                      className="form-control"
                      type="date"
                      value={dateToISO(this.state.start)}
                      onChange={e => {
                        this.setState({
                          start: new Date(
                            timeMinusDate(this.state.start) +
                              new Date(e.target.valueAsNumber).getTime(),
                          ),
                        });
                      }}
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3">
                    <select
                      className="form-control"
                      value={this.state.start.getHours()}
                      onChange={e =>
                        this.setState({
                          start: new Date(
                            dateMinusTime(this.state.start).getTime() +
                              e.target.value * 3600000,
                          ),
                        })
                      }>
                      {Array(24)
                        .fill(1)
                        .map((x, i) => (
                          <option value={i} key={i}>
                            {i}h00
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
			  <Label for="title">{t("Ending date:")}</Label>
                  </Col>
                  <Col xs="6" md="4" lg="3">
                    <input
                      className="form-control"
                      type="date"
                      value={dateToISO(this.state.finish)}
                      min={dateToISO(this.state.start)}
                      onChange={e => {
                        this.setState({
                          finish: new Date(
                            timeMinusDate(this.state.finish) +
                              new Date(e.target.valueAsNumber).getTime(),
                          ),
                        });
                      }}
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3">
                    <select
                      className="form-control"
                      value={this.state.finish.getHours()}
                      onChange={e =>
                        this.setState({
                          finish: new Date(
                            dateMinusTime(this.state.finish).getTime() +
                              e.target.value * 3600000,
                          ),
                        })
                      }>
                      {Array(24)
                        .fill(1)
                        .map((x, i) => (
                          <option value={i} key={i}>
                            {i}h00
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
			  <Label for="title">{t("Grades:")}</Label>
                  </Col>
                  <Col xs="10" sm="11" md="4" lg="3">
                    <select
                      className="form-control"
                      tabIndex={this.state.candidates.length + 3}
                      onChange={this.handleChangeNumGrades}
                      defaultValue="7">
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </Col>
                  <Col xs="auto" className="align-self-center pl-0 ">
                    <HelpButton>
			{t("You can select here the number of grades for your election")}
                      <br />
			      <u>{t("For example:")}</u>{' '}
                      <em>
                        {' '}
			{t("5 = Excellent, Very good, Good, Fair, Passable")}
                      </em>
                    </HelpButton>
                  </Col>
                  <Col
                    xs="12"
                    md="9"
                    lg="10"
                    className="offset-xs-0 offset-md-3 offset-lg-2">
                    {grades.map((mention, i) => {
                      return (
                        <span
                          key={i}
                          className="badge badge-light mr-2 mt-2 "
                          style={{
                            backgroundColor: mention.color,
                            color: '#fff',
                            opacity: i < this.state.numGrades ? 1 : 0.3,
                          }}>
                          {mention.label}
                        </span>
                      );
                    })}
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
			  <Label for="title">{t("Participants:")}</Label>
                  </Col>
                  <Col xs="12" md="9" lg="10">
                    <ReactMultiEmail
                      placeholder={t("Add here participants' emails")}
                      emails={electorEmails}
                      onChange={(_emails) => {
                        this.setState({electorEmails: _emails});
                      }}
                      validateEmail={email => {
                        return isEmail(email); // return boolean
                      }}
                      getLabel={(
                        email,
                        index,
                        removeEmail,
                      ) => {
                        return (
                          <div data-tag key={index}>
                            {email}
                            <span
                              data-tag-handle
                              onClick={() => removeEmail(index)}>
                              ×
                            </span>
                          </div>
                        );
                      }}
                    />
                    <div>
                      <small className="text-muted">
			      {t("List voters' emails in case the election is not opened")}
                      </small>
                    </div>
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
              </CardBody>
            </Card>
          </Collapse>
          <Row className="justify-content-end mt-2">
            <Col xs="12" md="3">
              {this.state.numCandidatesWithLabel >= 2 ? (
                <ButtonWithConfirm
                  className="btn btn-success float-right btn-block"
                  tabIndex={this.state.candidates.length + 4}>
                  <div key="button">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
			    {t("Validate")}
                  </div>
                  <div key="modal-title">{t("Confirm your vote")}</div>
                  <div key="modal-body">
                    <div className="mt-1 mb-1">
                      <div className="text-white bg-primary p-1">
			      {t("Question of the election")}
                      </div>
                      <div className="p-1 pl-3">
                        <em>{this.state.title}</em>
                      </div>
                      <div className="text-white bg-primary p-1">
			      {t("Candidates/Proposals")}
                      </div>
                      <div className="p-1 pl-0">
                        <ul className="m-0 pl-4">
                          {this.state.candidates.map((candidate, i) => {
                            if (candidate.label !== '') {
                              return (
                                <li key={i} className="m-0">
                                  {candidate.label}
                                </li>
                              );
                            } else {
                              return <li key={i} className="d-none" />;
                            }
                          })}
                        </ul>
                      </div>
                      <div className="text-white bg-primary p-1 mt-1">
			      {t("Dates")}
                      </div>
                      <p className="p-1 pl-3">
		      {t("The election will take place from")}{' '}
                        <b>
                          {this.state.start.toLocaleDateString()}, {t("at")}{' '}
                          {this.state.start.toLocaleTimeString()}
                        </b>{' '}{t("to")}{' '}
                        <b>
                          {this.state.finish.toLocaleDateString()}, {t("at")}{' '}
                          {this.state.finish.toLocaleTimeString()}
                        </b>
                      </p>
                      <div className="text-white bg-primary p-1">{t("Grades")}</div>
                      <div className="p-1 pl-3">
                        {grades.map((mention, i) => {
                          return i < this.state.numGrades ? (
                            <span
                              key={i}
                              className="badge badge-light mr-2 mt-2"
                              style={{
                                backgroundColor: mention.color,
                                color: '#fff',
                              }}>
                              {mention.label}
                            </span>
                          ) : (
                            <span key={i} />
                          );
                        })}
                      </div>
                      <div className="text-white bg-primary p-1 mt-1">
			      {t("Voters' list")}
                      </div>
                      <div className="p-1 pl-3">
                        {electorEmails.length > 0 ? (
                          electorEmails.join(', ')
                        ) : (
                          <p>
			{t("The form contains no address.")}
                            <br />
                            <em>
			    {t("The election will be opened to anyone with the link")}
                            </em>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div key="modal-confirm" onClick={this.handleSubmit}>
			  {t("Start the election")}
                  </div>
                  <div key="modal-cancel">{t("Cancel")}</div>
                </ButtonWithConfirm>
              ) : (
                <Button
                  type="button"
                  className="btn btn-dark float-right btn-block"
                  onClick={this.handleSendWithoutCandidate}>
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
			  {t("Confirm")}
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
}
export default withTranslation()(withRouter(CreateElection));

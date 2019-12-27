import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
  CardBody
} from "reactstrap";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resolve } from "url";
import HelpButton from "../form/HelpButton";
import {
  arrayMove,
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import ButtonWithConfirm from "../form/ButtonWithConfirm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faCheck,
  faCogs
} from "@fortawesome/free-solid-svg-icons";

import { grades } from "../../Util";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";

const DragHandle = sortableHandle(({ children }) => (
  <span className="input-group-text indexNumber">{children}</span>
));

const SortableCandidate = sortableElement(({ candidate, sortIndex, form }) => (
  <li className="sortable">
    <Row key={"rowCandidate" + sortIndex}>
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
            placeholder="Nom du candidat ou de la proposition ..."
            tabIndex={sortIndex + 1}
            innerRef={ref => (form.candidateInputs[sortIndex] = ref)}
            maxLength="250"
          />
          <ButtonWithConfirm className="btn btn-primary input-group-append border-light">
            <div key="button">
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
            <div key="modal-title">Suppression ?</div>
            <div key="modal-body">
              Êtes-vous sûr de vouloir supprimer{" "}
              {candidate.label !== "" ? (
                <b>"{candidate.label}"</b>
              ) : (
                <span>la ligne {sortIndex + 1}</span>
              )}{" "}
              ?
            </div>
            <div
              key="modal-confirm"
              onClick={() => form.removeCandidate(sortIndex)}
            >
              Oui
            </div>
            <div key="modal-cancel">Non</div>
          </ButtonWithConfirm>
        </InputGroup>
      </Col>
      <Col xs="auto" className="align-self-center pl-0">
        <HelpButton>
          Saisissez ici le nom de votre candidat ou de votre proposition (250
          caractères max.)
        </HelpButton>
      </Col>
    </Row>
  </li>
));

const SortableCandidatesContainer = sortableContainer(({ items, form }) => {
  return (
    <ul className="sortable">
      {items.map((candidate, index) => (
        <SortableCandidate
          key={`item-${index}`}
          index={index}
          sortIndex={index}
          candidate={candidate}
          form={form}
        />
      ))}
    </ul>
  );
});

class CreateElection extends Component {
  constructor(props) {
    super(props);
    //default value : start now
    const startedAt = new Date();
    const startedHour = startedAt.getHours();
    //default value : finish in one week
    const finishedAt = new Date(startedAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.state = {
      candidates: [{ label: "" }, { label: "" }],
      numCandidatesWithLabel: 0,
      title: null,
      isVisibleTipsDragAndDropCandidate: true,
      numGrades: 7,
      successCreate: false,
      redirectTo: null,
      isAdvancedOptionsOpen: false,
      startedDayAt: startedAt.toISOString().substring(0, 10),
      finishedDayAt: finishedAt.toISOString().substring(0, 10),
      startedTimeAt: Math.floor(startedHour / 2) * 2 + ":00:00",
      finishedTimeAt: "23:59:59",
      electorEmails: []
    };
    this.candidateInputs = [];
    this.focusInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  addCandidate = event => {
    let candidates = this.state.candidates;
    if (candidates.length < 100) {
      candidates.push({ label: "" });
      this.setState({ candidates: candidates });
    }
    if (event.type === "keypress") {
      setTimeout(() => {
        this.candidateInputs[this.state.candidates.length - 1].focus();
      }, 250);
    }
  };

  removeCandidate = index => {
    let candidates = this.state.candidates;
    candidates.splice(index, 1);
    console.log(candidates.length);
    if (candidates.length === 0) {
      candidates = [{ label: "" }];
    }
    this.setState({ candidates: candidates });
  };

  editCandidateLabel = (event, index) => {
    let candidates = this.state.candidates;
    let numLabels = 0;
    candidates[index].label = event.currentTarget.value;
    candidates.map((candidate, i) => {
      if (candidate.label !== "") {
        numLabels++;
      }
      return candidate.label;
    });
    this.setState({
      candidates: candidates,
      numCandidatesWithLabel: numLabels
    });
  };

  handleKeypressOnCandidateLabel = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (index + 1 === this.state.candidates.length) {
        this.addCandidate(event);
      } else {
        this.candidateInputs[index + 1].focus();
      }
    }
  };

  onCandidatesSortEnd = ({ oldIndex, newIndex }) => {
    let candidates = this.state.candidates;
    candidates = arrayMove(candidates, oldIndex, newIndex);
    this.setState({ candidates: candidates });
  };

  handleChangeNumGrades = event => {
    this.setState({ numGrades: event.target.value });
  };

  toggleAdvancedOptions = () => {
    this.setState({ isAdvancedOptionsOpen: !this.state.isAdvancedOptionsOpen });
  };

  componentWillMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.setState({ title: params.get("title") ? params.get("title") : "" });
  }

  handleSubmit() {
    const { candidates, title, numGrades } = this.state;

    const endpoint = resolve(process.env.REACT_APP_SERVER_URL, "election/");

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        candidates: candidates.map(c => c.label),
        on_invitation_only: this.state.electorEmails.length > 0,
        num_grades: numGrades,
        elector_emails: this.state.electorEmails,
        started_at: this.state.startedDayAt + " " + this.state.startedTimeAt,
        finished_at: this.state.finishedDayAt + " " + this.state.finishedTimeAt,
        time_offset: new Date().getTimezoneOffset()
      })
    })
      .then(response => response.json())
      .then(result =>
        this.setState(state => ({
          redirectTo: "/create-success/" + result.id,
          successCreate: true
        }))
      )
      .catch(error => error);
  }

  handleSendWithoutCandidate = () => {
    toast.error("Vous devez saisir au moins deux candidats !", {
      position: toast.POSITION.TOP_CENTER
    });
  };

  formatDate = (dateIsoStr, timeIsoStr) => {
    let date = new Date(dateIsoStr + "T" + timeIsoStr);
    let day = date.getDate();
    let month = date.getMonth() + 1; //Months are zero based
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let hoursString = hours + "h" + minutes;
    if (hoursString === "23h59") {
      hoursString = "minuit";
    }

    return day + "/" + month + "/" + year + " à " + hoursString;
  };

  render() {
    const { successCreate, redirectTo } = this.state;
    const { electorEmails } = this.state;
    const params = new URLSearchParams(this.props.location.search);

    if (successCreate) return <Redirect to={redirectTo} />;

    return (
      <Container>
        <ToastContainer />
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <Col>
              <h3>Démarrer un vote</h3>
            </Col>
          </Row>
          <hr />
          <Row className="mt-4">
            <Col xs="12">
              <Label for="title">Question du vote :</Label>
            </Col>
            <Col>
              <Input
                placeholder="Saisissez ici la question de votre vote"
                tabIndex="1"
                name="title"
                id="title"
                innerRef={this.focusInput}
                autoFocus
                defaultValue={params.get("title") ? params.get("title") : ""}
                onChange={this.handleChangeTitle}
                maxLength="250"
              />
            </Col>
            <Col xs="auto" className="align-self-center pl-0">
              <HelpButton>
                Posez ici votre question ou introduisez simplement votre vote
                (250 caractères max.)
                <br />
                <u>Par exemple :</u>{" "}
                <em>Pour être mon représentant, je juge ce candidat ...</em>
              </HelpButton>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs="12">
              <Label for="title">Candidats / Propositions :</Label>
            </Col>
            <Col xs="12">
              <SortableCandidatesContainer
                items={this.state.candidates}
                onSortEnd={this.onCandidatesSortEnd}
                form={this}
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
                onClick={event => this.addCandidate(event)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Ajouter une proposition
              </Button>
            </Col>
            <Col
              xs="12"
              sm="6"
              md="12"
              className="text-center text-sm-right text-md-left"
            >
              <Button
                color="link"
                className="text-white mt-3 mb-1"
                onClick={this.toggleAdvancedOptions}
              >
                <FontAwesomeIcon icon={faCogs} className="mr-2" />
                Options avancées
              </Button>
            </Col>
          </Row>
          <Collapse isOpen={this.state.isAdvancedOptionsOpen}>
            <Card>
              <CardBody className="text-primary">
                <Row>
                  <Col xs="12" md="3" lg="2">
                    <Label for="title">Date de début :</Label>
                  </Col>
                  <Col xs="6" md="4" lg="3">
                    <input
                      className="form-control"
                      type="date"
                      value={this.state.startedDayAt}
                      onChange={e =>
                        this.setState({ startedDayAt: e.target.value })
                      }
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3">
                    <select
                      className="form-control"
                      value={this.state.startedTimeAt}
                      onChange={e =>
                        this.setState({ startedTimeAt: e.target.value })
                      }
                    >
                      <option value="2:00:00">02h00</option>
                      <option value="3:00:00">03h00</option>
                      <option value="4:00:00">04h00</option>
                      <option value="6:00:00">06h00</option>
                      <option value="8:00:00">08h00</option>
                      <option value="10:00:00">10h00</option>
                      <option value="12:00:00">12h00</option>
                      <option value="16:00:00">16h00</option>
                      <option value="18:00:00">18h00</option>
                      <option value="20:00:00">20h00</option>
                      <option value="22:00:00">22h00</option>
                      <option value="23:59:59">Minuit</option>
                    </select>
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
                    <Label for="title">Date de fin :</Label>
                  </Col>
                  <Col xs="6" md="4" lg="3">
                    <input
                      className="form-control"
                      type="date"
                      value={this.state.finishedDayAt}
                      min={this.state.startedDayAt}
                      onChange={e =>
                        this.setState({ finishedDayAt: e.target.value })
                      }
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3">
                    <select
                      className="form-control"
                      value={this.state.finishedTimeAt}
                      onChange={e =>
                        this.setState({ finishedTimeAt: e.target.value })
                      }
                    >
                      <option value="2:00:00">02h00</option>
                      <option value="3:00:00">03h00</option>
                      <option value="4:00:00">04h00</option>
                      <option value="6:00:00">06h00</option>
                      <option value="8:00:00">08h00</option>
                      <option value="10:00:00">10h00</option>
                      <option value="12:00:00">12h00</option>
                      <option value="16:00:00">16h00</option>
                      <option value="18:00:00">18h00</option>
                      <option value="20:00:00">20h00</option>
                      <option value="22:00:00">22h00</option>
                      <option value="23:59:59">Minuit</option>
                    </select>
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
                    <Label for="title">Mentions :</Label>
                  </Col>
                  <Col xs="10" sm="11" md="4" lg="3">
                    <select
                      className="form-control"
                      tabIndex={this.state.candidates.length + 3}
                      onChange={this.handleChangeNumGrades}
                      defaultValue="7"
                    >
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </Col>
                  <Col xs="auto" className="align-self-center pl-0 ">
                    <HelpButton>
                      Vous pouvez choisir ici le nombre de mentions pour votre
                      vote
                      <br />
                      <u>Par exemple : </u>{" "}
                      <em>
                        {" "}
                        5 = Excellent, Très bien, bien, assez bien, passable
                      </em>
                    </HelpButton>
                  </Col>
                  <Col
                    xs="12"
                    md="9"
                    lg="10"
                    className="offset-xs-0 offset-md-3 offset-lg-2"
                  >
                    {grades.map((mention, i) => {
                      return (
                        <span
                          key={i}
                          className="badge badge-light mr-2 mt-2 "
                          style={{
                            backgroundColor: mention.color,
                            color: "#fff",
                            opacity: i < this.state.numGrades ? 1 : 0.3
                          }}
                        >
                          {mention.label}
                        </span>
                      );
                    })}
                  </Col>
                </Row>
                <hr className="mt-2 mb-2" />
                <Row>
                  <Col xs="12" md="3" lg="2">
                    <Label for="title">Participants :</Label>
                  </Col>
                  <Col xs="12" md="9" lg="10">
                    <ReactMultiEmail
                      placeholder="Saisissez ici les e-mails des participants"
                      emails={electorEmails}
                      onChange={(_emails: string[]) => {
                        this.setState({ electorEmails: _emails });
                      }}
                      validateEmail={email => {
                        return isEmail(email); // return boolean
                      }}
                      getLabel={(
                        email: string,
                        index: number,
                        removeEmail: (index: number) => void
                      ) => {
                        return (
                          <div data-tag key={index}>
                            {email}
                            <span
                              data-tag-handle
                              onClick={() => removeEmail(index)}
                            >
                              ×
                            </span>
                          </div>
                        );
                      }}
                    />
                    <div>
                      <small className="text-muted">
                        Liste des e-mails à préciser si vous désirez réaliser un
                        vote fermé.
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
                  tabIndex={this.state.candidates.length + 4}
                >
                  <div key="button">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Valider
                  </div>
                  <div key="modal-title">Confirmez votre vote</div>
                  <div key="modal-body">
                    <div className="mt-1 mb-1">
                      <div className="text-white bg-primary p-1">
                        Question du vote
                      </div>
                      <div className="p-1 pl-3">
                        <em>{this.state.title}</em>
                      </div>
                      <div className="text-white bg-primary p-1">
                        Candidats/Propositions
                      </div>
                      <div className="p-1 pl-0">
                        <ul className="m-0 pl-4">
                          {this.state.candidates.map((candidate, i) => {
                            if (candidate.label !== "") {
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
                        Dates
                      </div>
                      <p className="p-1 pl-3">
                        Le vote se déroulera du{" "}
                        <b>
                          {this.formatDate(
                            this.state.startedDayAt,
                            this.state.startedTimeAt
                          )}
                        </b>{" "}
                        au{" "}
                        <b>
                          {this.formatDate(
                            this.state.finishedDayAt,
                            this.state.finishedTimeAt
                          )}
                        </b>
                      </p>
                      <div className="text-white bg-primary p-1">Mentions</div>
                      <div className="p-1 pl-3">
                        {grades.map((mention, i) => {
                          return i < this.state.numGrades ? (
                            <span
                              key={i}
                              className="badge badge-light mr-2 mt-2"
                              style={{
                                backgroundColor: mention.color,
                                color: "#fff"
                              }}
                            >
                              {mention.label}
                            </span>
                          ) : (
                            <span key={i} />
                          );
                        })}
                      </div>
                      <div className="text-white bg-primary p-1 mt-1">
                        Liste des électeurs
                      </div>
                      <div className="p-1 pl-3">
                        {electorEmails.length > 0 ? (
                          electorEmails.join(", ")
                        ) : (
                          <p>
                            Aucune adresse e-mail précisée.
                            <br />
                            <em>
                              Le vote sera ouvert à tous les utilisateurs ayant
                              le lien du vote
                            </em>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div key="modal-confirm" onClick={this.handleSubmit}>
                    Lancer le vote
                  </div>
                  <div key="modal-cancel">Annuler</div>
                </ButtonWithConfirm>
              ) : (
                <Button
                  type="button"
                  className="btn btn-dark float-right btn-block"
                  onClick={this.handleSendWithoutCandidate}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Valider
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
}
export default CreateElection;

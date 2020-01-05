import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { resolve } from "url";
import { grades } from "../../Util";
import { AppContext } from "../../AppContext";

class Vote extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      title: null,
      numGrades: 0,
      ratedCandidates: [],
      colSizeCandidateLg: 4,
      colSizeCandidateMd: 6,
      colSizeCandidateXs: 12,
      colSizeGradeLg: 1,
      colSizeGradeMd: 1,
      colSizeGradeXs: 1,
      redirectTo: null,
      electionGrades: grades
    };
  }

  handleErrors = response => {
    if (!response.ok) {
      response.json().then(response => {
        console.log(response);
        this.setState(state => ({
          redirectTo: "/unknown-election/" + encodeURIComponent(response)
        }));
      });
      throw Error(response);
    }
    return response;
  };

  detailsToState = response => {
    const numGrades = response.num_grades;
    const candidates = response.candidates.map((c, i) => ({
      id: i,
      label: c
    }));
    //shuffle candidates
    let i, j, temp;
    for (i = candidates.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = candidates[i];
      candidates[i] = candidates[j];
      candidates[j] = temp;
    }
    const colSizeGradeLg = Math.floor(
      (12 - this.state.colSizeCandidateLg) / numGrades
    );
    const colSizeGradeMd = Math.floor(
      (12 - this.state.colSizeCandidateMd) / numGrades
    );
    const colSizeGradeXs = Math.floor(
      (12 - this.state.colSizeCandidateXs) / numGrades
    );

    this.setState(state => ({
      title: response.title,
      candidates: candidates,
      numGrades: numGrades,
      colSizeGradeLg: colSizeGradeLg,
      colSizeGradeMd: colSizeGradeMd,
      colSizeGradeXs: colSizeGradeXs,
      colSizeCandidateLg:
        12 - colSizeGradeLg * numGrades > 0
          ? 12 - colSizeGradeLg * numGrades
          : 12,
      colSizeCandidateMd:
        12 - colSizeGradeMd * numGrades > 0
          ? 12 - colSizeGradeMd * numGrades
          : 12,
      colSizeCandidateXs:
        12 - colSizeGradeXs * numGrades > 0
          ? 12 - colSizeGradeXs * numGrades
          : 12,
      electionGrades: grades.slice(0, numGrades)
    }));
    return response;
  };

  componentDidMount() {
    // FIXME we should better handling logs
    const electionSlug = this.props.match.params.slug;
    const detailsEndpoint = resolve(
      this.context.urlServer,
      this.context.routesServer.getElection.replace(
        new RegExp(":slug", "g"),
          electionSlug
      )
    );
    fetch(detailsEndpoint)
      .then(this.handleErrors)
      .then(response => response.json())
      .then(this.detailsToState)
      .catch(error => console.log(error));
  }

  handleGradeClick = event => {
    let data = {
      id: parseInt(event.currentTarget.getAttribute("data-id")),
      value: parseInt(event.currentTarget.value)
    };
    //remove candidate
    let ratedCandidates = this.state.ratedCandidates.filter(
      ratedCandidate => ratedCandidate.id !== data.id
    );
    ratedCandidates.push(data);
    this.setState({ ratedCandidates: ratedCandidates });
  };

  handleSubmitWithoutAllRate = () => {
    toast.error("Vous devez évaluer l'ensemble des propositions/candidats !", {
      position: toast.POSITION.TOP_CENTER
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { ratedCandidates } = this.state;
    const electionSlug = this.props.match.params.slug;
    const endpoint = resolve(
      this.context.urlServer,
      this.context.routesServer.voteElection.replace(
        new RegExp(":slug", "g"),
        electionSlug
      )
    );

    const gradesById = {};
    ratedCandidates.forEach(c => {
      gradesById[c.id] = c.value;
    });
    const gradesByCandidate = [];
    Object.keys(gradesById)
      .sort()
      .forEach(id => {
        gradesByCandidate.push(gradesById[id]);
      });

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        election: electionSlug,
        grades_by_candidate: gradesByCandidate
      })
    })
      .then(this.handleErrors)
      .then(result =>
        this.setState({ redirectTo: "/vote-success/" + electionSlug })
      )
      .catch(error => error);
  };

  render() {
    const { redirectTo, candidates, electionGrades } = this.state;

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <Container>
        <ToastContainer />
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <Col>
              <h3>{this.state.title}</h3>
            </Col>
          </Row>
          <Row className="cardVote d-none d-lg-flex">
            <Col
              xs={this.state.colSizeCandidateXs}
              md={this.state.colSizeCandidateMd}
              lg={this.state.colSizeCandidateLg}
            >
              <h5>&nbsp;</h5>
            </Col>
            {electionGrades.map((grade, j) => {
              return j < this.state.numGrades ? (
                <Col
                  xs={this.state.colSizeGradeXs}
                  md={this.state.colSizeGradeMd}
                  lg={this.state.colSizeGradeLg}
                  key={j}
                  className="text-center p-0"
                  style={{ lineHeight: 2 }}
                >
                  <small
                    className="nowrap bold badge"
                    style={{ backgroundColor: grade.color, color: "#fff" }}
                  >
                    {grade.label}
                  </small>
                </Col>
              ) : null;
            })}
          </Row>

          {candidates.map((candidate, i) => {
            return (
              <Row key={i} className="cardVote">
                <Col
                  xs={this.state.colSizeCandidateXs}
                  md={this.state.colSizeCandidateMd}
                  lg={this.state.colSizeCandidateLg}
                >
                  <h5 className="m-0">{candidate.label}</h5>
                  <hr className="d-lg-none" />
                </Col>
                {this.state.electionGrades.map((grade, j) => {
                  return j < this.state.numGrades ? (
                    <Col
                      xs={this.state.colSizeGradeXs}
                      md={this.state.colSizeGradeMd}
                      lg={this.state.colSizeGradeLg}
                      key={j}
                      className="text-lg-center"
                    >
                      <label
                        htmlFor={"candidateGrade" + i + "-" + j}
                        className="check"
                      >
                        <small
                          className="nowrap d-lg-none ml-2 bold badge"
                          style={
                            this.state.ratedCandidates.find(function(
                              ratedCandidat
                            ) {
                              return (
                                JSON.stringify(ratedCandidat) ===
                                JSON.stringify({ id: candidate.id, value: j })
                              );
                            })
                              ? { backgroundColor: grade.color, color: "#fff" }
                              : {
                                  backgroundColor: "transparent",
                                  color: "#000"
                                }
                          }
                        >
                          {grade.label}
                        </small>
                        <input
                          type="radio"
                          name={"candidate" + i}
                          id={"candidateGrade" + i + "-" + j}
                          data-index={i}
                          data-id={candidate.id}
                          value={j}
                          onClick={this.handleGradeClick}
                          defaultChecked={this.state.ratedCandidates.find(
                            function(element) {
                              return (
                                JSON.stringify(element) ===
                                JSON.stringify({ id: candidate.id, value: j })
                              );
                            }
                          )}
                        />
                        <span
                          className="checkmark"
                          style={
                            this.state.ratedCandidates.find(function(
                              ratedCandidat
                            ) {
                              return (
                                JSON.stringify(ratedCandidat) ===
                                JSON.stringify({ id: candidate.id, value: j })
                              );
                            })
                              ? { backgroundColor: grade.color, color: "#fff" }
                              : {
                                  backgroundColor: "transparent",
                                  color: "#000"
                                }
                          }
                        />
                      </label>
                    </Col>
                  ) : null;
                })}
              </Row>
            );
          })}

          <Row>
            <Col className="text-center">
              {this.state.ratedCandidates.length !==
              this.state.candidates.length ? (
                <Button
                  type="button"
                  onClick={this.handleSubmitWithoutAllRate}
                  className="btn btn-dark "
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Valider
                </Button>
              ) : (
                <Button type="submit" className="btn btn-success ">
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
export default Vote;

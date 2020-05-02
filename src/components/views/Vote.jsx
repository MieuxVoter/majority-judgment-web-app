/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Button, Col, Container, Row } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { resolve } from "url";
import { i18nGrades } from "../../Util";
import { AppContext } from "../../AppContext";
import { errorMessage } from "../../Errors";

const shuffle = array => array.sort(() => Math.random() - 0.5);

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
      electionGrades: i18nGrades(),
      errorMsg: ""
    };
  }

  handleErrors = response => {
    if (!response.ok) {
      response.json().then(response => {
        console.log(response);
        const { t } = this.props;
        this.setState(() => ({
          errorMsg: errorMessage(response, t)
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
    shuffle(candidates);

    const colSizeGradeLg = Math.floor(
      (12 - this.state.colSizeCandidateLg) / numGrades
    );
    const colSizeGradeMd = Math.floor(
      (12 - this.state.colSizeCandidateMd) / numGrades
    );
    const colSizeGradeXs = Math.floor(
      (12 - this.state.colSizeCandidateXs) / numGrades
    );

    this.setState(() => ({
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
          : 12
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
    this.setState({ ratedCandidates });
  };

  handleSubmitWithoutAllRate = () => {
    const { t } = this.props;
    toast.error(t("You have to judge every candidate/proposal!"), {
      position: toast.POSITION.TOP_CENTER
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { ratedCandidates } = this.state;
    const electionSlug = this.props.match.params.slug;
    const token = this.props.location.search.substr(7);
    const endpoint = resolve(
      this.context.urlServer,
      this.context.routesServer.voteElection
    );

    const gradesById = {};
    ratedCandidates.forEach(c => {
      gradesById[c.id] = c.value;
    });
    const gradesByCandidate = [];
    Object.keys(gradesById).forEach(id => {
      gradesByCandidate.push(gradesById[id]);
    });

    const payload = {
      election: electionSlug,
      grades_by_candidate: gradesByCandidate
    };
    if (token !== "") {
      payload["token"] = token;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(this.handleErrors)
      .then(() =>
        this.setState({ redirectTo: "/vote-success/" + electionSlug })
      )
      .catch(error => error);
  };

  render() {
    const { t } = this.props;
    const { candidates, errorMsg, redirectTo } = this.state;
    const grades = i18nGrades();
    const offsetGrade = grades.length - this.state.numGrades;
    const electionGrades = grades.slice(0, this.state.numGrades);

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    if (errorMsg !== "") {
      return (
        <Container>
          <Row>
            <Col>
              <h3>{errorMsg}</h3>
            </Col>
          </Row>
        </Container>
      );
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
            {electionGrades.map((grade, gradeId) => {
              return gradeId < this.state.numGrades ? (
                <Col
                  xs={this.state.colSizeGradeXs}
                  md={this.state.colSizeGradeMd}
                  lg={this.state.colSizeGradeLg}
                  key={gradeId}
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

          {candidates.map((candidate, candidateId) => {
            return (
              <Row key={candidateId} className="cardVote">
                <Col
                  xs={this.state.colSizeCandidateXs}
                  md={this.state.colSizeCandidateMd}
                  lg={this.state.colSizeCandidateLg}
                >
                  <h5 className="m-0">{candidate.label}</h5>
                  <hr className="d-lg-none" />
                </Col>
                {electionGrades.map((grade, gradeId) => {
                  console.assert(gradeId < this.state.numGrades);
                  const gradeValue = grade.value - offsetGrade;
                  return (
                    <Col
                      xs={this.state.colSizeGradeXs}
                      md={this.state.colSizeGradeMd}
                      lg={this.state.colSizeGradeLg}
                      key={gradeId}
                      className="text-lg-center"
                    >
                      <label
                        htmlFor={
                          "candidateGrade" + candidateId + "-" + gradeValue
                        }
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
                                JSON.stringify({
                                  id: candidate.id,
                                  value: gradeValue
                                })
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
                          name={"candidate" + candidateId}
                          id={"candidateGrade" + candidateId + "-" + gradeValue}
                          data-index={candidateId}
                          data-id={candidate.id}
                          value={grade.value - offsetGrade}
                          onClick={this.handleGradeClick}
                          defaultChecked={this.state.ratedCandidates.find(
                            function(element) {
                              return (
                                JSON.stringify(element) ===
                                JSON.stringify({
                                  id: candidate.id,
                                  value: gradeValue
                                })
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
                                JSON.stringify({
                                  id: candidate.id,
                                  value: gradeValue
                                })
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
                  );
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
                  {t("Submit my vote")}
                </Button>
              ) : (
                <Button type="submit" className="btn btn-success ">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  {t("Submit my vote")}
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
}
export default withTranslation()(Vote);

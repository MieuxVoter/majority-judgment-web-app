/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { resolve } from "url";
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  Table
} from "reactstrap";
import { i18nGrades } from "../../Util";
import { AppContext } from "../../AppContext";
import { errorMessage, Error } from "../../Errors";
import Facebook from "../banner/Facebook";

class Result extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      title: null,
      numGrades: 0,
      colSizeCandidateLg: 4,
      colSizeCandidateMd: 6,
      colSizeCandidateXs: 12,
      colSizeGradeLg: 1,
      colSizeGradeMd: 1,
      colSizeGradeXs: 1,
      collapseGraphics: false,
      collapseProfiles: false,
      electionGrades: i18nGrades(),
      errorMessage: ""
    };
  }

  handleErrors = response => {
    if (!response.ok) {
      response.json().then(response => {
        this.setState(() => ({
          errorMessage: errorMessage(response, this.props.t)
        }));
      });
      throw Error(response);
    }
    return response;
  };

  resultsToState = response => {
    const candidates = response.map(c => ({
      id: c.id,
      name: c.name,
      profile: c.profile,
      grade: c.grade
    }));
    this.setState(() => ({ candidates: candidates }));
    return response;
  };

  detailsToState = response => {
    const numGrades = response.num_grades;
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
      electionGrades: i18nGrades().slice(0, numGrades)
    }));
    return response;
  };

  componentDidMount() {
    // get details of the election
    const electionSlug = this.props.match.params.slug;
    if (electionSlug === "dev") {
      const dataTest = [
        {
          name: "BB",
          id: 1,
          score: 1.0,
          profile: [1, 1, 0, 0, 0, 0, 0],
          grade: 1
        },
        {
          name: "CC",
          id: 2,
          score: 1.0,
          profile: [0, 0, 2, 0, 0, 0, 0],
          grade: 2
        },
        {
          name: "AA",
          id: 0,
          score: 1.0,
          profile: [1, 1, 0, 0, 0, 0, 0],
          grade: 1
        }
      ];
      this.setState({ candidates: dataTest });
    } else {
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

      // get results of the election
      const resultsEndpoint = resolve(
        this.context.urlServer,
        this.context.routesServer.getResultsElection.replace(
          new RegExp(":slug", "g"),
          electionSlug
        )
      );

      fetch(resultsEndpoint)
        .then(this.handleErrors)
        .then(response => response.json())
        .then(this.resultsToState)
        .catch(error => console.log(error));
    }
  }

  toggleGraphics = () => {
    this.setState(state => ({ collapseGraphics: !state.collapseGraphics }));
  };

  toggleProfiles = () => {
    this.setState(state => ({ collapseProfiles: !state.collapseProfiles }));
  };

  render() {
    const { errorMessage, candidates, electionGrades } = this.state;
    const { t } = this.props;
    const i18nGradesObject = i18nGrades();
    const offsetGrade = i18nGradesObject.length - this.state.numGrades;

    if (errorMessage && errorMessage !== "") {
      return <Error value={errorMessage} />;
    }

    const sum = seq => Object.values(seq).reduce((a, b) => a + b, 0);
    const numVotes =
      candidates && candidates.length > 0 ? sum(candidates[0].profile) : 1;
    const gradeIds =
      candidates && candidates.length > 0
        ? Object.keys(candidates[0].profile)
        : [];

    return (
      <Container>
        <Row>
          <Col xs="12">
            <h3>{this.state.title}</h3>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <ol className="result">
              {candidates.map((candidate, i) => {
                const gradeValue = candidate.grade + offsetGrade;
                return (
                  <li key={i} className="mt-2">
                    <span className="mt-2 ml-2">{candidate.name}</span>
                    <span
                      className="badge badge-light ml-2 mt-2"
                      style={{
                        backgroundColor: electionGrades.slice(0).reverse()[
                          candidate.grade
                        ].color,
                        color: "#fff"
                      }}
                    >
                      {i18nGradesObject.slice(0).reverse()[gradeValue].label}
                    </span>
                    {/* <span className="badge badge-dark mt-2 ml-2">
                      {(100 * candidate.score).toFixed(1)}%
                    </span> */}
                  </li>
                );
              })}
            </ol>
            <h5>
              <small>
                {t("Number of votes:")}
                {" " + numVotes}
              </small>
            </h5>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className="bg-light text-primary">
              <CardHeader className="pointer" onClick={this.toggleGraphics}>
                <h4
                  className={
                    "m-0 panel-title " +
                    (this.state.collapseGraphics ? "collapsed" : "")
                  }
                >
                  {t("Graph")}
                </h4>
              </CardHeader>
              <Collapse isOpen={this.state.collapseGraphics}>
                <CardBody className="pt-5">
                  <div>
                    <div
                      className="median"
                      style={{ height: candidates.length * 28 + 30 }}
                    />
                    <table style={{ width: "100%" }}>
                      <tbody>
                        {candidates.map((candidate, i) => {
                          return (
                            <tr key={i}>
                              <td style={{ width: "30px" }}>{i + 1}</td>
                              {/*candidate.label*/}
                              <td>
                                <table style={{ width: "100%" }}>
                                  <tbody>
                                    <tr>
                                      {gradeIds
                                        .slice(0)
                                        .reverse()
                                        .map((id, i) => {
                                          const value = candidate.profile[id];
                                          if (value > 0) {
                                            let percent =
                                              (value * 100) / numVotes + "%";
                                            if (i === 0) {
                                              percent = "auto";
                                            }
                                            return (
                                              <td
                                                key={i}
                                                style={{
                                                  width: percent,
                                                  backgroundColor: this.state
                                                    .electionGrades[i].color
                                                }}
                                              >
                                                &nbsp;
                                              </td>
                                            );
                                          } else {
                                            return null;
                                          }
                                        })}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <small>
                      {candidates.map((candidate, i) => {
                        return (
                          <span key={i}>
                            {i > 0 ? ", " : ""}
                            <b>{i + 1}</b>: {candidate.name}
                          </span>
                        );
                      })}
                    </small>
                  </div>
                  <div className="mt-2">
                    <small>
                      {electionGrades.map((grade, i) => {
                        return (
                          <span
                            key={i}
                            className="badge badge-light mr-2 mt-2"
                            style={{
                              backgroundColor: grade.color,
                              color: "#fff"
                            }}
                          >
                            {grade.label}
                          </span>
                        );
                      })}
                    </small>
                  </div>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card className="bg-light text-primary">
              <CardHeader className="pointer" onClick={this.toggleProfiles}>
                <h4
                  className={
                    "m-0 panel-title " +
                    (this.state.collapseProfiles ? "collapsed" : "")
                  }
                >
                  {t("Preference profile")}
                </h4>
              </CardHeader>
              <Collapse isOpen={this.state.collapseProfiles}>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="profiles">
                      <thead>
                        <tr>
                          <th>#</th>
                          {electionGrades.map((grade, i) => {
                            return (
                              <th key={i}>
                                <span
                                  className="badge badge-light"
                                  style={{
                                    backgroundColor: grade.color,
                                    color: "#fff"
                                  }}
                                >
                                  {grade.label}{" "}
                                </span>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((candidate, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              {gradeIds
                                .slice(0)
                                .reverse()
                                .map((id, i) => {
                                  const value = candidate.profile[id];
                                  const percent = (
                                    (value / numVotes) *
                                    100
                                  ).toFixed(1);
                                  return <td key={i}>{percent} %</td>;
                                })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  <small>
                    {candidates.map((candidate, i) => {
                      return (
                        <span key={i}>
                          {i > 0 ? ", " : ""}
                          <b>{i + 1}</b>: {candidate.name}
                        </span>
                      );
                    })}
                  </small>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="text-center pt-2 pb-5">
            <Facebook
                className="btn btn-outline-light m-2"
                text={t("Share results on Facebook")}
                url={window.location.origin + "/result/" + this.props.match.params.slug}
                title={encodeURI(this.state.title)}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withTranslation()(Result);

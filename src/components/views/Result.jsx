import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { resolve } from "url";
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button
} from "reactstrap";
import { grades } from "../../Util"
import { Link } from "react-router-dom";;

class Result extends Component {
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
      redirectLost: false,
      electionGrades: grades
    };
  }

  handleErrors = response => {
    if (!response.ok) {
      response.json().then(response => {
        this.setState(state => ({
          redirectLost: "/unknown-election/" + encodeURIComponent(response)
        }));
      });
      throw Error(response);
    }
    return response;
  };

  resultsToState = response => {
    const candidates = response.map(c => ({
      id: c.id,
      label: c.name,
      profile: c.profile,
      grade: c.grade,
      score: c.score
    }));
    this.setState(state => ({ candidates: candidates }));
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
    this.setState(state => ({
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
      electionGrades: grades.slice(0, numGrades)
    }));
    return response;
  };

  componentDidMount() {
    // FIXME we should better handling logs

    const electionSlug = this.props.match.params.handle;

    // get details of the election
    const detailsEndpoint = resolve(
      process.env.REACT_APP_SERVER_URL,
      "election/get/".concat(electionSlug)
    );

    fetch(detailsEndpoint)
      .then(this.handleErrors)
      .then(response => response.json())
      .then(this.detailsToState)
      .catch(error => console.log(error));

    // get results of the election
    const resultsEndpoint = resolve(
      process.env.REACT_APP_SERVER_URL,
      "election/results/".concat(electionSlug)
    );

    fetch(resultsEndpoint)
      .then(this.handleErrors)
      .then(response => response.json())
      .then(this.resultsToState)
      .catch(error => console.log(error));
  }

  toggleGraphics = () => {
    this.setState(state => ({ collapseGraphics: !state.collapseGraphics }));
  };

  toggleProfiles = () => {
    this.setState(state => ({ collapseProfiles: !state.collapseProfiles }));
  };

  render() {
    const { redirectLost, candidates, electionGrades } = this.state;

    if (redirectLost) {
      return <Redirect to={redirectLost} />;
    }

    return (
      <Container>
        <Row>
          <Col xs="12">
            <h1>{this.state.title}</h1>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h1>Résultat du vote :</h1>
            <ol>
              {candidates.map((candidate, i) => {
                return (
                  <li key={i} className="mt-2">
                    {candidate.label}
                    <span className="badge badge-dark mr-2 mt-2">
                      {candidate.score}%
                    </span>
                    <span
                      className="badge badge-light mr-2 mt-2"
                      style={{
                        backgroundColor: electionGrades[candidate.grade].color,
                        color: "#fff"
                      }}
                    >
                      {grades[candidate.grade].label}
                    </span>
                  </li>
                );
              })}
            </ol>
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
                  Graphique
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
                                      {candidate.profile.map((value, i) => {
                                        if (value > 0) {
                                          let percent = value + "%";
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
                            <b>{i + 1}</b>: {candidate.label}
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
                  Profils de mérites
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
                              {/*candidate.label*/}
                              {candidate.profile.map((value, i) => {
                                return <td key={i}>{value}%</td>;
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
                          <b>{i + 1}</b>: {candidate.label}
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
          <Col>
            <h2 className="text-center ml-2"> Cette nouvelle manière de voter vous a plu ? Notre devoir est de rendre les éléctions aux élécteurs. Aidez-nous en adhérant à Mieux Voter ! Plus de détail <a href= "https://www.helloasso.com/associations/mieux-voter" target="_blank">ici</a>.</h2>
            <Link to="/">
              <Button
              type="button"
              className="btn btn-dark float-right btn-block"
              >
                    Retour à l'acceuil.
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Result;

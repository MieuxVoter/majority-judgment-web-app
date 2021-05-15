import { useState } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  Table,
} from "reactstrap";
import { getResults, getDetails, apiErrors } from "@services/api";
import { grades } from "@services/grades";
import { translateGrades } from "@services/grades";
import Facebook from "@components/banner/Facebook";
import Error from "@components/Error";
import config from "../../../next-i18next.config.js";

export async function getServerSideProps({ query, locale }) {
  const { pid, tid } = query;

  const [res, details, translations] = await Promise.all([
    getResults(
      pid,
      (res) => ({ ok: true, res }),
      (err) => {
        return { ok: false, err: "Unknown error" };
      }
    ),
    getDetails(
      pid,
      (res) => ({ ok: true, ...res }),
      (err) => ({ ok: false, err: "Unknown error" })
    ),
    serverSideTranslations(locale, [], config),
  ]);

  if (!res.ok) {
    return { props: { err: res.err, ...translations } };
  }
  if (!details.ok) {
    return { props: { err: details.err, ...translations } };
  }

  return {
    props: {
      title: details.title,
      numGrades: details.num_grades,
      candidates: res.res,
      pid: pid,
      ...translations,
    },
  };
}

const Result = ({ candidates, numGrades, title, pid, err }) => {
  const { t } = useTranslation();

  if (err && err !== "") {
    return <Error value={apiErrors(err, t)} />;
  }

  const router = useRouter();

  const allGrades = translateGrades(t);
  const grades = allGrades.filter(
    (grade) => grade.value >= allGrades.length - numGrades
  );
  const offsetGrade = grades.length - numGrades;

  const colSizeCandidateLg = 4;
  const colSizeCandidateMd = 6;
  const colSizeCandidateXs = 12;
  const colSizeGradeLg = 1;
  const colSizeGradeMd = 1;
  const colSizeGradeXs = 1;

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost";
  console.log("origin", origin);
  const urlVote = new URL(`/vote/${pid}`, origin);

  const [collapseProfiles, setCollapseProfiles] = useState(false);
  const [collapseGraphics, setCollapseGraphics] = useState(false);

  const sum = (seq) => Object.values(seq).reduce((a, b) => a + b, 0);
  const numVotes =
    candidates && candidates.length > 0 ? sum(candidates[0].profile) : 1;
  const gradeIds =
    candidates && candidates.length > 0
      ? Object.keys(candidates[0].profile)
      : [];

  return (
    <Container>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
      </Head>
      <Row>
        <Col xs="12">
          <h3>{title}</h3>
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
                      backgroundColor: grades.slice(0).reverse()[
                        candidate.grade
                      ].color,
                      color: "#fff",
                    }}
                  >
                    {allGrades.slice(0).reverse()[gradeValue].label}
                  </span>
                </li>
              );
            })}
          </ol>
          <h5>
            <small>
              {t("resource.numVotes")}
              {" " + numVotes}
            </small>
          </h5>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="bg-light text-primary">
            <CardHeader
              className="pointer"
              onClick={() => setCollapseGraphics(!collapseGraphics)}
            >
              <h4
                className={
                  "m-0 panel-title " + (collapseGraphics ? "collapsed" : "")
                }
              >
                {t("Graph")}
              </h4>
            </CardHeader>
            <Collapse isOpen={collapseGraphics}>
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
                                                backgroundColor:
                                                  grades[i].color,
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
                    {grades.map((grade, i) => {
                      return (
                        <span
                          key={i}
                          className="badge badge-light mr-2 mt-2"
                          style={{
                            backgroundColor: grade.color,
                            color: "#fff",
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
            <CardHeader
              className="pointer"
              onClick={() => setCollapseProfiles(!collapseProfiles)}
            >
              <h4
                className={
                  "m-0 panel-title " + (collapseProfiles ? "collapsed" : "")
                }
              >
                {t("Preference profile")}
              </h4>
            </CardHeader>
            <Collapse isOpen={collapseProfiles}>
              <CardBody>
                <div className="table-responsive">
                  <Table className="profiles">
                    <thead>
                      <tr>
                        <th>#</th>
                        {grades.map((grade, i) => {
                          return (
                            <th key={i}>
                              <span
                                className="badge badge-light"
                                style={{
                                  backgroundColor: grade.color,
                                  color: "#fff",
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
            url={urlVote}
            title={title}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default Result;

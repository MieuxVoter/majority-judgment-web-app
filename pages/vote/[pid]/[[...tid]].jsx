import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Button, Col, Container, Row } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { getDetails, castBallot, apiErrors } from "@services/api";
import Error from "@components/Error";
import { translateGrades } from "@services/grades";
import config from "../../../next-i18next.config.js";

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export async function getServerSideProps({ query: { pid, tid }, locale }) {
  const [res, translations] = await Promise.all([
    getDetails(
      pid,
      (res) => {
        console.log("DETAILS:", res);
        return { ok: true, ...res };
      },
      (err) => {
        console.log("ERR:", err);
        return { ok: false, err: "Unknown error" };
      }
    ),
    serverSideTranslations(locale, [], config),
  ]);

  if (!res.ok) {
    return { props: { err: res.err, ...translations } };
  }

  console.log(res);

  shuffle(res.candidates);

  return {
    props: {
      ...translations,
      invitationOnly: res.on_invitation_only,
      restrictResults: res.restrict_results,
      candidates: res.candidates.map((name, i) => ({ id: i, label: name })),
      title: res.title,
      numGrades: res.num_grades,
      pid: pid,
      token: tid || null,
    },
  };
}

const VoteBallot = ({ candidates, title, numGrades, pid, err, token }) => {
  if (err) {
    return <Error value={err}></Error>;
  }

  const [judgments, setJudgments] = useState([]);
  const colSizeCandidateLg = 4;
  const colSizeCandidateMd = 6;
  const colSizeCandidateXs = 12;
  const colSizeGradeLg = Math.floor((12 - colSizeCandidateLg) / numGrades);
  const colSizeGradeMd = Math.floor((12 - colSizeCandidateMd) / numGrades);
  const colSizeGradeXs = Math.floor((12 - colSizeCandidateXs) / numGrades);

  const router = useRouter();

  const { t } = useTranslation();
  const allGrades = translateGrades(t);
  const grades = allGrades.filter(
    (grade) => grade.value >= allGrades.length - numGrades
  );

  const handleGradeClick = (event) => {
    let data = {
      id: parseInt(event.currentTarget.getAttribute("data-id")),
      value: parseInt(event.currentTarget.value),
    };
    //remove candidate
    const newJudgments = judgments.filter(
      (judgment) => judgment.id !== data.id
    );
    newJudgments.push(data);
    setJudgments(newJudgments);
  };

  const handleSubmitWithoutAllRate = () => {
    toast.error(t("You have to judge every candidate/proposal!"), {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const gradesById = {};
    judgments.forEach((c) => {
      gradesById[c.id] = c.value;
    });
    const gradesByCandidate = [];
    Object.keys(gradesById).forEach((id) => {
      gradesByCandidate.push(gradesById[id]);
    });

    castBallot(gradesByCandidate, pid, token, () => {
      router.push(`/vote/${pid}/confirm`);
    });
  };

  return (
    <Container>
      <Head>
        <title>{title}</title>

        <title>{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t("common.application")}
        />
      </Head>
      <ToastContainer />
      <form onSubmit={handleSubmit} autoComplete="off">
        <Row>
          <Col>
            <h3>{title}</h3>
          </Col>
        </Row>
        <Row className="cardVote d-none d-lg-flex">
          <Col
            xs={colSizeCandidateXs}
            md={colSizeCandidateMd}
            lg={colSizeCandidateLg}
          >
            <h5>&nbsp;</h5>
          </Col>
          {grades.map((grade, gradeId) => {
            return gradeId < numGrades ? (
              <Col
                xs={colSizeGradeXs}
                md={colSizeGradeMd}
                lg={colSizeGradeLg}
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
                xs={colSizeCandidateXs}
                md={colSizeCandidateMd}
                lg={colSizeCandidateLg}
              >
                <h5 className="m-0">{candidate.label}</h5>
                <hr className="d-lg-none" />
              </Col>
              {grades.map((grade, gradeId) => {
                console.assert(gradeId < numGrades);
                const gradeValue = grade.value;
                return (
                  <Col
                    xs={colSizeGradeXs}
                    md={colSizeGradeMd}
                    lg={colSizeGradeLg}
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
                          judgments.find((judgment) => {
                            return (
                              JSON.stringify(judgment) ===
                              JSON.stringify({
                                id: candidate.id,
                                value: gradeValue,
                              })
                            );
                          })
                            ? { backgroundColor: grade.color, color: "#fff" }
                            : {
                                backgroundColor: "transparent",
                                color: "#000",
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
                        value={grade.value}
                        onClick={handleGradeClick}
                        defaultChecked={judgments.find((element) => {
                          return (
                            JSON.stringify(element) ===
                            JSON.stringify({
                              id: candidate.id,
                              value: gradeValue,
                            })
                          );
                        })}
                      />
                      <span
                        className="checkmark"
                        style={
                          judgments.find(function (judgment) {
                            return (
                              JSON.stringify(judgment) ===
                              JSON.stringify({
                                id: candidate.id,
                                value: gradeValue,
                              })
                            );
                          })
                            ? { backgroundColor: grade.color, color: "#fff" }
                            : {
                                backgroundColor: "transparent",
                                color: "#000",
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
            {judgments.length !== candidates.length ? (
              <Button
                type="button"
                onClick={handleSubmitWithoutAllRate}
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
};
export default VoteBallot;

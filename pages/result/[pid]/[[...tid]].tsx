import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
} from 'reactstrap';
import { getResults, getDetails, apiErrors } from '@services/api';
import { translateGrades } from '@services/grades';
import Error from '@components/Error';
import config from '../../../next-i18next.config.js';
import Footer from '@components/layouts/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

export async function getServerSideProps({ query, locale }) {
  const { pid, tid } = query;

  const [res, details, translations] = await Promise.all([
    getResults(pid),
    getDetails(pid),
    serverSideTranslations(locale, [], config),
  ]);

  if (typeof res === 'string' || res instanceof String) {
    return { props: { err: res.slice(1, -1), ...translations } };
  }

  if (typeof details === 'string' || details instanceof String) {
    return { props: { err: res.slice(1, -1), ...translations } };
  }

  if (!details.candidates || !Array.isArray(details.candidates)) {
    return { props: { err: 'Unknown error', ...translations } };
  }

  return {
    props: {
      title: details.title,
      numGrades: details.num_grades,
      finish: details.finish_at,
      candidates: res,
      pid: pid,
      ...translations,
    },
  };
}

const Result = ({ candidates, numGrades, title, pid, err, finish }) => {
  const { t } = useTranslation();

  const newstart = new Date(finish * 1000).toLocaleDateString('fr-FR');

  if (err && err !== '') {
    return <Error msg={t(apiErrors(err))} />;
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
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'http://localhost';
  const urlVote = new URL(`/vote/${pid}`, origin);

  const collapsee = candidates[0].title;
  const [collapseProfiles, setCollapseProfiles] = useState(false);
  const [collapseGraphics, setCollapseGraphics] = useState(false);

  const sum = (seq: Array<number>) =>
    Object.values(seq).reduce((a, b) => a + b, 0);
  const numVotes =
    candidates && candidates.length > 0 ? sum(candidates[0].profile) : 1;
  const gradeIds =
    candidates && candidates.length > 0
      ? Object.keys(candidates[0].profile)
      : [];

  return (
    <Container className="resultContainer resultPage">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
      </Head>
      <Row className="sectionHeaderResult componentDesktop mx-0">
        <Col className="col-md-3 sectionHeaderResultLeftCol">
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/calendar.svg" />
              <p>{newstart}</p>
            </Col>
          </Row>
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/avatarBlue.svg" />
              <p>{' ' + numVotes} votants</p>
            </Col>
          </Row>
        </Col>

        <Col className="sectionHeaderResultMiddleCol">
          <h3>{title}</h3>
        </Col>

        <Col className="col-md-3 sectionHeaderResultRightCol">
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/arrowUpload.svg" />
              <p>Télécharger les résultats</p>
            </Col>
          </Row>
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/arrowL.svg" />
              <p>Partagez les résultats</p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="sectionHeaderResult componentMobile mx-0">
        <Col className="px-0">
          <h3>{title}</h3>
        </Col>
        <Row>
          <Col className="sectionHeaderResultSideCol">
            <img src="/calendar.svg" />
            <p>{newstart}</p>
          </Col>
          <Col className="sectionHeaderResultSideCol">
            <img src="/avatarBlue.svg" />
            <p>{' ' + numVotes} votants</p>
          </Col>
        </Row>
      </Row>

      <section className="sectionContentResult mb-5">
        <Row className="mt-5 componentDesktop">
          <Col>
            <ol className="result px-0">
              {candidates.map((candidate, i) => {
                const gradeValue = candidate.grade + offsetGrade;
                return (
                  <li key={i} className="mt-2">
                    <span className="resultPosition">{i + 1}</span>
                    <span className="my-3">{candidate.name}</span>
                    <span
                      className="badge badge-light"
                      style={{
                        backgroundColor: grades.slice(0).reverse()[
                          candidate.grade
                        ].color,
                        color: '#fff',
                      }}
                    >
                      {allGrades.slice(0).reverse()[gradeValue].label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h5>
              <small>{t('Détails des résultats')}</small>
            </h5>
            {candidates.map((candidate, i) => {
              const gradeValue = candidate.grade + offsetGrade;
              return (
                <Card className="bg-light text-primary my-3">
                  <CardHeader
                    className="pointer"
                    onClick={() => setCollapseGraphics(!collapseGraphics)}
                  >
                    <h4
                      className={'m-0 ' + (collapseGraphics ? 'collapsed' : '')}
                    >
                      <span
                        key={i}
                        className="d-flex panel-title justify-content-between"
                      >
                        <div className="d-flex">
                          <span className="resultPositionCard ">{i + 1}</span>
                          <span className="candidateName">
                            {candidate.name}
                          </span>
                        </div>
                        <div>
                          <span
                            className="badge badge-light"
                            style={{
                              backgroundColor: grades.slice(0).reverse()[
                                candidate.grade
                              ].color,
                              color: '#fff',
                            }}
                          >
                            {allGrades.slice(0).reverse()[gradeValue].label}
                          </span>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="openIcon"
                          />
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            className="closeIcon"
                          />
                        </div>
                      </span>
                    </h4>
                  </CardHeader>
                  <Collapse isOpen={collapseGraphics}>
                    <CardBody className="pt-5">
                      <Row className="column">
                        <Col>
                          {t('Preference profile')}

                          <div>
                            <div
                              className="median"
                              style={{ height: '40px' }}
                            />
                            <div style={{ width: '100%' }}>
                              <div key={i}>
                                {/*candidate.label*/}

                                <div style={{ width: '100%' }}>
                                  {gradeIds
                                    .slice(0)
                                    .reverse()
                                    .map((id, i) => {
                                      const value = candidate.profile[id];
                                      if (value > 0) {
                                        let percent =
                                          (value * 100) / numVotes + '%';
                                        if (i === 0) {
                                          percent = 'auto';
                                        }
                                        return (
                                          <div
                                            key={i}
                                            style={{
                                              width: percent,
                                              backgroundColor: grades[i].color,
                                            }}
                                          >
                                            &nbsp;
                                          </div>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <p>Graph bulles</p>
                        </Col>
                      </Row>
                      <Row className="linkResult my-3">
                        <Link href="/" className="mx-auto">
                          {t('Comment interpréter les résultats')}
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="closeIcon"
                          />
                        </Link>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
              );
            })}
          </Col>
        </Row>
        <div className="componentMobile mt-5">
          <Row>
            <Button className="cursorPointer btn-result btn-validation mb-5 btn btn-secondary">
              <img src="/arrowUpload.svg" />
              <p>Télécharger les résultats</p>
            </Button>
          </Row>
          <Row>
            <Button className="cursorPointer btn-result btn-validation mb-5 btn btn-secondary">
              <img src="/arrowL.svg" />
              <p>Partagez les résultats</p>
            </Button>
          </Row>
        </div>
      </section>
      <Footer />
    </Container>
  );
};
export default Result;

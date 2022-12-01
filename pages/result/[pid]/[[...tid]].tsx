import {useState} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useRouter} from 'next/router';
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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '@components/Error';
import Logo from '@components/Logo';
import {getResults, getElection, apiErrors, ResultsPayload, CandidatePayload, GradePayload} from '@services/api';
import {getUrlAdmin} from '@services/routes';
import {getMajorityGrade} from '@services/majorityJudgment';
import avatarBlue from '../../../public/avatarBlue.svg'
import calendar from '../../../public/calendar.svg'
import arrowUpload from '../../../public/arrowUpload.svg'
import arrowLink from '../../../public/arrowL.svg'
import {getGradeColor} from '@services/grades';


interface GradeInterface extends GradePayload {
  color: string;
}

interface CandidateInterface extends CandidatePayload {
  majorityGrade: GradeInterface;
  rank: number;
}

interface ElectionInterface {
  name: string;
  description: string;
  ref: string;
  dateStart: string;
  dateEnd: string;
  hideResults: boolean;
  forceClose: boolean;
  restricted: boolean;
  grades: Array<GradeInterface>;
  candidates: Array<CandidateInterface>;
}


interface ResultInterface extends ElectionInterface {
  ranking: {[key: string]: number};
  meritProfile: {[key: number]: Array<number>};
}

export async function getServerSideProps({query, locale}) {
  const {pid, tid: token} = query;
  const electionRef = pid.replace("-", "");

  const [payload, translations] = await Promise.all([
    getResults(electionRef),
    serverSideTranslations(locale, ["resource"]),
  ]);

  if (typeof payload === 'string' || payload instanceof String) {
    return {props: {err: payload, ...translations}};
  }

  const numGrades = payload.grades.length;
  const grades = payload.grades.map((g, i) => ({...g, color: getGradeColor(i, numGrades)}));
  const gradesByValue: {[key: number]: GradeInterface} = {}
  grades.forEach(g => gradesByValue[g.value] = g)

  const result: ResultInterface = {
    name: payload.name,
    description: payload.description,
    ref: payload.ref,
    dateStart: payload.date_start,
    dateEnd: payload.date_end,
    hideResults: payload.hide_results,
    forceClose: payload.force_close,
    restricted: payload.restricted,
    grades: grades,
    candidates: payload.candidates.map(c => ({
      ...c,
      rank: payload.ranking[c.id],
      majorityGrade: gradesByValue[getMajorityGrade(payload.merit_profile[c.id])]
    })),
    ranking: payload.ranking,
    meritProfile: payload.merit_profile,

  }

  return {
    props: {
      result,
      token: token || "",
      ...translations,
    },
  };
}


const getNumVotes = (result: ResultInterface) => {
  const sum = (seq: Array<number>) =>
    Object.values(seq).reduce((a, b) => a + b, 0);
  const anyCandidateId = result.candidates[0].id;
  const numVotes = sum(result.meritProfile[anyCandidateId]);
  Object.values(result.meritProfile).forEach(v => {
    if (sum(v) !== numVotes) {
      throw Error("The election does not contain the same number of votes for each candidate")
    }
  })
  return numVotes;
}


interface ResultBanner {
  result: ResultsPayload;
}
const ResultBanner = ({result}) => {
  const {t} = useTranslation();

  const dateEnd = new Date(result.date_end);
  const now = new Date();
  const closedSince = +dateEnd - (+now);

  const numVotes = getNumVotes(result)

  return (<div className="w-100 bg-white p-5 justify-content-between align-items-center">
    <div className="text-muted">
      <div className="d-flex align-items-center">
        <Image alt="Calendar" src={calendar} />
        <p>{closedSince > 0 ? `${t('result.has-closed')} {closedSince}` : `${t('result.will-close')} {closedSince}`} {t('common.days')}</p>
      </div>
      <div className="d-flex align-items-center">
        <Image src={avatarBlue} alt="Avatar" />
        <p>{`${numVotes} ${t('common.participants')}`}</p>
      </div>
    </div>

    <h3>{result.name}</h3>

    <div className="text-muted">
      <div className="d-flex align-items-center">
        <Image alt="Download" src={arrowUpload} />
        <p>{t('result.download')}</p>
      </div>
      <div className="d-flex align-items-center">
        <Image src={arrowLink} alt="Share" />
        <p>{t('result.share')}</p>
      </div>
    </div>
  </div >
  )
}


const BottomButtonsMobile = () => {
  const {t} = useTranslation();
  return (
    <div className="d-block d-md-none mt-5">
      <Button className="cursorPointer btn-result btn-validation mb-5 btn btn-secondary">
        <Image alt="Download" src={arrowUpload} />
        <p>{t('result.download')}</p>
      </Button>
      <Button className="cursorPointer btn-result btn-validation mb-5 btn btn-secondary">
        <Image src={arrowLink} alt="Share" />
        <p>{t('result.share')}</p>
      </Button>
    </div>
  )
}


interface TitleBannerInterface {
  name: string;
  electionRef: string;
  token?: string;
}

const TitleBanner = ({name, electionRef, token}: TitleBannerInterface) => {
  const {t} = useTranslation();
  return (
    <div className="d-none d-md-flex p-3 justify-content-between text-white">
      <div className="d-flex">
        <Logo title={false} />
        <h5>{name}</h5>
      </div>
      {token ?
        <div className="d-flex">
          <Link href={getUrlAdmin(electionRef, token)}>
            <Button icon={faGear} position="left">{t('result.go-to-admin')}</Button>
          </Link>
        </div> : null
      }

    </div>
  )
}


interface ButtonGradeInterface {
  grade: GradeInterface;
}

const ButtonGrade = ({grade}: ButtonGradeInterface) => {

  const style = {
    color: 'white',
    backgroundColor: grade.color,
  };

  return (
    <div
      style={style}
      className="py-2 px-3 m-1 fw-bold rounded-1 d-flex justify-content-between gap-3"
    >
      {grade.name}
    </div>
  );
};

interface CandidateRankedInterface {
  candidate: CandidateInterface;
}

const CandidateRanked = ({candidate}: CandidateRankedInterface) => {
  const isFirst = candidate.rank == 1;
  return <div>
    <div className={isFirst ? "text-primary bg-white fs-5" : "text-white bg-secondary fs-6"}>
      {candidate.rank}
    </div>
    <div className={`text-white ${isFirst ? "fs-4" : "fs-6"}`}>
      {candidate.name}
    </div>
    <ButtonGrade grade={candidate.majorityGrade} />
  </div>
}


interface PodiumInterface {
  candidates: Array<CandidateInterface>;
}


const Podium = ({candidates}: PodiumInterface) => {
  const {t} = useTranslation();

  // get best candidates
  const numBest = Math.min(3, candidates.length);
  const candidatesByRank = {}
  candidates.forEach(c => candidatesByRank[c.rank] = c)

  if (numBest < 2) {
    throw Error("Can not load enough candidates");
  }

  if (numBest === 2) {
    return (<div>
      <CandidateRanked candidate={candidates[0]} />
      <CandidateRanked candidate={candidates[1]} />
    </div>)
  }


  return (<div>
    <CandidateRanked candidate={candidates[1]} />
    <CandidateRanked candidate={candidates[0]} />
    <CandidateRanked candidate={candidates[2]} />
  </div>)
}

interface ResultPageInterface {
  result?: ResultInterface;
  token?: string;
  err?: string;
}


const ResultPage = ({result, token, err}: ResultPageInterface) => {
  const {t} = useTranslation();
  const router = useRouter();

  if (err && err !== '') {
    return <ErrorMessage msg={err} />;
  }

  if (!result) {
    return <ErrorMessage msg="error.catch22" />;
  }


  if (typeof result.candidates === "undefined" || result.candidates.length === 0) {
    throw Error("No candidates were loaded in this election")
  }

  // const collapsee = result.candidates[0].name;
  // const [collapseProfiles, setCollapseProfiles] = useState(false);
  // const [collapseGraphics, setCollapseGraphics] = useState(false);

  const numVotes = getNumVotes(result)

  return (
    <Container className="resultContainer resultPage">
      <Head>
        <title>{result.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={result.name} />
      </Head>
      <TitleBanner electionRef={result.ref} token={token} name={result.name} />
      <ResultBanner result={result} />

      <Podium candidates={result.candidates} />

      <section className="sectionContentResult mb-5">
        <Row className="mt-5 componentDesktop">
          <Col>
            <ol className="result px-0">
              {result.candidates.map((candidate, i) => {
                return (
                  <li key={i} className="mt-2">
                    <span className="resultPosition">{i + 1}</span>
                    <span className="my-3">{candidate.name}</span>
                    <span
                      className="badge badge-light"
                      style={{
                        backgroundColor: candidate.majorityGrade.color,
                        color: '#fff',
                      }}
                    >
                      {candidate.majorityGrade.name}
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
            {result.candidates.map((candidate, i) => {
              return (
                <Card className="bg-light text-primary my-3">
                  <CardHeader
                    className="pointer"
                  >
                    {/*onClick={() => setCollapseGraphics(!collapseGraphics)}*/}
                    <h4
                    >
                      {/* className={'m-0 ' + (collapseGraphics ? 'collapsed' : '')}*/}
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
                              backgroundColor: candidate.majorityGrade.color,
                              color: '#fff',
                            }}
                          >
                            {candidate.majorityGrade.name}
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
                  <Collapse
                  >
                    {/*isOpen={collapseGraphics}*/}
                    <CardBody className="pt-5">
                      <Row className="column">
                        <Col>
                          {t('Preference profile')}

                          <div>
                            <div
                              className="median"
                              style={{height: '40px'}}
                            />
                            <div style={{width: '100%'}}>
                              <div key={i}>

                                <div style={{width: '100%'}}>
                                  {/* gradeIds
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
                                    })*/}
                                </div>
                              </div>
                            </div>
                          </div>
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
        <BottomButtonsMobile />
      </section>
    </Container>
  );
};

export default ResultPage;

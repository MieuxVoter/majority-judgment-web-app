import {useState} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import {Container, Collapse, Card, CardHeader, CardBody} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import ErrorMessage from '@components/Error';
import CSVLink from '@components/CSVLink';
import Logo from '@components/Logo';
import MeritProfile from '@components/MeritProfile';
import Button from '@components/Button';
import {
  ErrorPayload,
  getElection,
  getResults,
  NO_RECORDED_VOTES_ERROR_CODE,
  RESULTS_HIDDEN_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} from '@services/api';
import {
  GradeResultInterface,
  ResultInterface,
  MeritProfileInterface,
  CandidateResultInterface,
} from '@services/type';
import {getUrl, RouteTypes} from '@services/routes';
import {displayRef, getFormattedDatetime, getLocaleShort} from '@services/utils';
import {getMajorityGrade} from '@services/majorityJudgment';
import avatarBlue from '../../../public/avatarBlue.svg';
import calendar from '../../../public/calendar.svg';
import arrowUpload from '../../../public/arrowUpload.svg';
import arrowLink from '../../../public/arrowL.svg';
import {getGradeColor} from '@services/grades';
import {useRouter} from 'next/router';

export async function getServerSideProps({query, locale}) {
  const {pid, tid: token} = query;
  const electionRef = pid.replaceAll('-', '');

  const [payload, electionPayload, translations] = await Promise.all([
    getResults(electionRef, token),
    await getElection(electionRef),
    serverSideTranslations(locale, ['resource']),
  ]);

  if ('message' in payload) {
    if (!('message' in electionPayload)) {
      const dateEnd = getFormattedDatetime(locale, electionPayload.date_end);
      return {props: {err: payload, electionRef, dateEnd, ...translations}};
    }

    return {props: {err: payload, electionRef, ...translations}};
  }

  const numGrades = payload.grades.length;
  const gradeValues = payload.grades.map((g) => g.value).sort();
  const grades = payload.grades.map((g) => {
    const gradeIdx = gradeValues.indexOf(g.value);
    if (gradeIdx === -1) {
      throw new Error('Could not find grade value in grades');
    }

    const color = getGradeColor(gradeIdx, numGrades);

    return {...g, color};
  });
  const gradesByValue: {[key: number]: GradeResultInterface} = {};
  grades.forEach((g) => (gradesByValue[g.value] = g));

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
    candidates: payload.candidates.map((c) => {
      const profile = payload.merit_profile[c.id];
      const values = grades.map((g) => g.value);
      values.forEach((v) => (profile[v] = profile[v] || 0));
      const majValue = getMajorityGrade(profile);
      return {
        ...c,
        meritProfile: payload.merit_profile[c.id],
        rank: payload.ranking[c.id] + 1,
        majorityGrade: gradesByValue[majValue],
      };
    }),
    ranking: payload.ranking,
    meritProfiles: payload.merit_profile,
  };

  return {
    props: {
      result,
      dateEnd: payload.date_end,
      token: token || '',
      ...translations,
    },
  };
}

const getNumVotes = (result: ResultInterface) => {
  const sum = (seq: MeritProfileInterface) =>
    Object.values(seq).reduce((a, b) => a + b, 0);
  const anyCandidateId = result.candidates[0].id;
  const numVotes = sum(result.meritProfiles[anyCandidateId]);
  Object.values(result.meritProfiles).forEach((v) => {
    if (sum(v) !== numVotes) {
      throw new Error(
        'The election does not contain the same number of votes for each candidate'
      );
    }
  });
  return numVotes;
};

interface ElectionStatusProps {
  delay: number | null;
  forceClose: boolean;
}

const ElectionStatus = ({delay, forceClose}: ElectionStatusProps) => {
  const {t} = useTranslation();
  console.log(delay, forceClose,);

  if (!delay) {
    if (forceClose) {
      return <div>{t('result.closed')}</div>;
    } else {
      return <div>{t('result.opened')}</div>;
    }
  }

  if (delay < 365 || forceClose) {
    return <div>{t('result.closed')}</div>;
  }
  if (delay < 0) {
    return (
      <div>{`${t('result.has-closed')} ${delay} ${t('common.days')}`}</div>
    );
  }
  if (delay > 365) {
    return <div>{t('result.opened')}</div>;
  }
  return (
    <div>{`${t('result.will-close')} ${delay} ${t('common.days')}`}</div>
  );
};

interface ResultBanner {
  result: ResultInterface;
}
const ResultBanner = ({result}) => {
  const {t} = useTranslation();
  const router = useRouter();

  const closedSince = typeof result.dateEnd === "string" ? +(new Date(result.dateEnd)) - +(new Date()) : null;

  const numVotes = getNumVotes(result);

  const locale = getLocaleShort(router);
  const url = getUrl(RouteTypes.RESULTS, locale, result.ref);

  return (
    <>
      {
        // MOBILE
      }
      <div className="w-100 bg-white p-4 d-flex flex-column d-md-none justify-content-center align-items-start">
        <h4 className="text-black">{result.name}</h4>

        <div className="text-muted w-100 d-flex justify-content-between">
          <div className="d-flex align-items-center flex-fill border-end border-end-2">
            <Image alt="Calendar" src={calendar} className="me-2" />
            <ElectionStatus delay={closedSince} forceClose={result.forceClose} />
          </div>
          <div className="d-flex align-items-center justify-content-end flex-fill">
            <Image src={avatarBlue} alt="Avatar" className="me-2" />
            <div>
              {numVotes}{' '}
              {numVotes > 1
                ? t('common.participants')
                : t('common.participant')}
            </div>
          </div>
        </div>
      </div>
      {
        // DESKTOP
      }
      <div className="w-100 bg-white gap-4 p-5 d-md-flex d-none justify-content-between align-items-center">
        <div className="text-muted">
          <div className="d-flex align-items-center">
            <Image alt="Calendar" src={calendar} className="me-2" />
            <ElectionStatus delay={closedSince} forceClose={result.forceClose} />
          </div>
          <div className="d-flex align-items-center">
            <Image src={avatarBlue} alt="Avatar" className="me-2" />
            <div>
              {numVotes}{' '}
              {numVotes > 1
                ? t('common.participants')
                : t('common.participant')}
            </div>
          </div>
        </div>

        <h4 className="text-black">{result.name}</h4>

        <div className="text-muted">
          <Downloader result={result}>
            <div role="button" className="d-flex align-items-center">
              <Image alt="Download" src={arrowUpload} className="me-2" />
              <div className="text-muted">{t('result.download')}</div>
            </div>
          </Downloader>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="d-flex align-items-center">
              <Image src={arrowLink} alt="Share" className="me-2" />
              <div className="text-muted">{t('result.share')}</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

const Downloader = ({result, children, ...rest}) => {
  const values = result.grades.map((v) => v.value).sort();
  const data = result.candidates.map((c) => {
    const grades = {};
    result.grades.forEach(
      (g) =>
      (grades[g.name] =
        g.value in c.meritProfile ? c.meritProfile[g.value].toString() : '0')
    );
    return {name: c.name, ...grades};
  });

  return (
    <CSVLink
      filename={`results-${displayRef(result.ref)}.csv`}
      {...rest}
      data={data}
    >
      {children}
    </CSVLink>
  );
};

const BottomButtonsMobile = ({result}) => {
  const {t} = useTranslation();

  const router = useRouter();
  const locale = getLocaleShort(router);
  const url = getUrl(RouteTypes.RESULTS, locale, result.ref);

  return (
    <div className="d-flex flex-column align-items-center d-md-none m-3">
      <Downloader result={result}>
        <Button
          className="m-3 d-flex align-items-center justify-content-between"
          role="button"
          color="primary"
          outline={false}
        >
          <Image alt="Download" src={arrowUpload} />
          <div className="ms-3">{t('result.download')}</div>
        </Button>
      </Downloader>
      <div>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            className="m-3 d-flex align-items-center justify-content-between"
            role="button"
            color="primary"
            outline={false}
          >
            <Image src={arrowLink} alt="Share" />
            <div className="ms-3">{t('result.share')}</div>
          </Button>
        </a>
      </div>
    </div>
  );
};

interface TitleBannerInterface {
  name: string;
  electionRef: string;
  token?: string;
}

const TitleBanner = ({name, electionRef, token}: TitleBannerInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <>
      {
        // MOBILE
      }
      <div className="d-md-none d-flex  p-4 justify-content-between text-white">
        <div className="d-flex  flex-fill align-items-center pe-5">
          <Logo title={false} />
          <h5 className="m-1 flex-fill text-center">{name}</h5>
        </div>
        {token ? (
          <div className="d-flex">
            <Link href={getUrl(RouteTypes.ADMIN, locale, electionRef, token)}>
              <Button icon={faGear} position="left">
                {t('result.go-to-admin')}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
      {
        // DESKTOP
      }
      <div className="d-none d-md-flex bg-primary p-4 justify-content-between text-white">
        <div className="d-flex align-items-center">
          <Logo height={38} title={true} />
          <h5 className="m-1 ms-5">{t('result.result')}</h5>
        </div>
        {token ? (
          <div className="d-flex">
            <Link href={getUrl(RouteTypes.ADMIN, locale, electionRef, token)}>
              <Button icon={faGear} position="left">
                {t('result.go-to-admin')}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
};

interface ButtonGradeResultInterface {
  grade: GradeResultInterface;
}

const ButtonGrade = ({grade}: ButtonGradeResultInterface) => {
  const style = {
    color: 'white',
    backgroundColor: grade.color,
  };

  return (
    <div
      style={style}
      className="p-2 fw-bold rounded-1 d-flex justify-content-between gap-3"
    >
      {grade.name}
    </div>
  );
};

interface CandidateRankedInterface {
  candidate: CandidateResultInterface;
}

const CandidateRanked = ({candidate}: CandidateRankedInterface) => {
  const isFirst = candidate.rank == 1;
  return (
    <div className="m-3 d-flex flex-column justify-content-end align-items-center candidate_rank fw-bold">
      <div
        className={
          isFirst
            ? 'text-primary bg-white fs-4 badge'
            : 'text-white bg-secondary fs-5 badge'
        }
      >
        {candidate.rank}
      </div>
      <div className={`text-white my-2 ${isFirst ? 'fs-4' : 'fs-5'}`}>
        {candidate.name}
      </div>
      <ButtonGrade grade={candidate.majorityGrade} />
    </div>
  );
};

interface CandidateCardInterface {
  candidate: CandidateResultInterface;
  grades: Array<GradeResultInterface>;
}

const CandidateCard = ({candidate, grades}: CandidateCardInterface) => {
  const {t} = useTranslation();
  const [collapse, setCollapse] = useState(true);

  return (
    <Card className="bg-light text-primary my-3">
      <CardHeader
        role="button"
        className="p-3 d-flex justify-content-between"
        onClick={() => setCollapse((s) => !s)}
      >
        <div className=" align-items-center d-flex">
          <span className="resultPositionCard me-2">{candidate.rank}</span>
          <span className="candidateName">{candidate.name}</span>
        </div>
        <div className="d-flex align-items-center">
          <ButtonGrade grade={candidate.majorityGrade} />
          <FontAwesomeIcon
            icon={collapse ? faChevronDown : faChevronUp}
            className="ms-2 text-black-50"
            size="xl"
          />
        </div>
      </CardHeader>
      <Collapse isOpen={!collapse}>
        <CardBody className="p-3 text-dark">
          {t('result.merit-profile')}
          <MeritProfile profile={candidate.meritProfile} grades={grades} />
          <a
            href="https://mieuxvoter.fr/le-jugement-majoritaire"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex w-100 align-items-center justify-content-center mt-5 text-black-50 fs-5"
          >
            <div>{t('result.how-to-interpret')}</div>
            <FontAwesomeIcon icon={faChevronRight} className="ms-3" />
          </a>
        </CardBody>
      </Collapse>
    </Card>
  );
};

interface PodiumInterface {
  candidates: Array<CandidateResultInterface>;
}

const Podium = ({candidates}: PodiumInterface) => {
  const {t} = useTranslation();

  // get best candidates
  const numBest = Math.min(3, candidates.length);
  const candidateByRank = {};
  candidates
    .filter((c) => c.rank < 4)
    .forEach((c) => (candidateByRank[c.rank] = c));

  if (numBest < 2) {
    throw new Error('Can not load enough candidates');
  }

  if (numBest === 2) {
    return (
      <div className="d-md-flex my-5  text-center justify-content-center d-none">
        <CandidateRanked candidate={candidateByRank[1]} />
        <CandidateRanked candidate={candidateByRank[2]} />
      </div>
    );
  }

  return (
    <div className="d-md-flex my-5 d-none  text-center justify-content-center">
      <CandidateRanked candidate={candidateByRank[2]} />
      <CandidateRanked candidate={candidateByRank[1]} />
      <CandidateRanked candidate={candidateByRank[3]} />
    </div>
  );
};

interface ResultPageInterface {
  result?: ResultInterface;
  token?: string;
  err?: ErrorPayload;
  electionRef?: string;
  dateEnd:string,
}

const ResultPage = ({
  result,
  token,
  err,
  dateEnd,
  electionRef,
}: ResultPageInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  if (err && err.error) {
    if (err.error == UNAUTHORIZED_ERROR_CODE){
      if (err.message.indexOf("Wrong authentication") !== -1)
        return ( 
          <ErrorMessage>
            <p>{t('result.wrong-auth')}</p>
          </ErrorMessage>
        );

      return ( 
        <ErrorMessage displayErrorTitle={false}>
          <p>{t('result.auth-required')}</p>
        </ErrorMessage>
      );
    }

    if (err.error == NO_RECORDED_VOTES_ERROR_CODE) {
      const urlVote = getUrl(RouteTypes.VOTE, locale, electionRef, token);
      return (
        <ErrorMessage>
          {
            <>
              <p>{t('result.no-votes')}</p>
              <Link href={urlVote}>
                <div className="d-md-flex d-grid">
                  <Button
                    className="d-md-flex d-grid"
                    color="primary"
                    icon={faArrowRight}
                    position="right"
                  >
                    {t('result.go-to-vote')}
                  </Button>
                </div>
              </Link>
            </>
          }
        </ErrorMessage>
      );
    }

    if (err.error == RESULTS_HIDDEN_ERROR_CODE) {
      const urlVote = getUrl(RouteTypes.VOTE, locale, electionRef, token);
      let hideResults = t('result.hide-results');
      
      return (
        <ErrorMessage>
          {
            <>
              <p>{hideResults}</p>
              { dateEnd && 
              <p>{t('result.end-date') + " " + dateEnd}</p>
              }
              <Link href={urlVote}>
                <div className="d-md-flex d-grid">
                  <Button color="primary" icon={faArrowRight} position="right">
                    {t('result.go-to-vote')}
                  </Button>
                </div>
              </Link>
            </>
          }
        </ErrorMessage>
      );
    }
  }

  if (!result) {
    return <ErrorMessage>{t('error.catch22')}</ErrorMessage>;
  }

  if (
    typeof result.candidates === 'undefined' ||
    result.candidates.length === 0
  ) {
    throw new Error('No candidates were loaded in this election');
  }

  const candidateByRank = {};
  result.candidates.forEach((c) => (candidateByRank[c.rank] = c));

  return (
    <Container className="h-100 resultContainer resultPage d-flex flex-column overflow-auto align-flex-stretch">
      <Head>
        <title>{result.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={result.name} />
      </Head>
      <TitleBanner electionRef={result.ref} token={token} name={result.name} />
      <ResultBanner result={result} />

      <Container style={{maxWidth: '1000px'}}>
        <Podium candidates={result.candidates} />
      </Container>

      <Container
        style={{maxWidth: '750px'}}
        className="my-5 h-100 d-flex flex-fill flex-column justify-content-between"
      >
        <div>
          <h5 className="text-white">{t('result.details')}</h5>
          {Object.keys(candidateByRank).map((rank, i) => {
            return (
              <CandidateCard
                candidate={candidateByRank[rank]}
                grades={result.grades}
                key={i}
              />
            );
          })}
        </div>
        <BottomButtonsMobile result={result} />
      </Container>
    </Container>
  );
};

export default ResultPage;

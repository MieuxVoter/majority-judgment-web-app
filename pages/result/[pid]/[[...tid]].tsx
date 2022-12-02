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
// import dynamic from 'next/dynamic'
import ErrorMessage from '@components/Error';
import CSVLink from '@components/CSVLink';
import Logo from '@components/Logo';
import MeritProfile from '@components/MeritProfile';
import {getResults} from '@services/api';
import {GradeResultInterface, ResultInterface, MeritProfileInterface, CandidateResultInterface} from '@services/type';
import {getUrlAdmin} from '@services/routes';
import {displayRef} from '@services/utils';
import {getMajorityGrade} from '@services/majorityJudgment';
import avatarBlue from '../../../public/avatarBlue.svg'
import calendar from '../../../public/calendar.svg'
import arrowUpload from '../../../public/arrowUpload.svg'
import arrowLink from '../../../public/arrowL.svg'
import {getGradeColor} from '@services/grades';



// /**
//  * See https://github.com/react-csv/react-csv/issues/87
//  */
// const CSVDownload = dynamic(
//   import('react-csv').then((m) => {
//     const {
//       CSVDownload
//     } = m
//     return CSVDownload
//   }), {
//   ssr: false,
//   loading: () => <a>placeholder component...</a>
// })


export async function getServerSideProps({query, locale}) {
  const {pid, tid: token} = query;
  const electionRef = pid.replaceAll("-", "");

  const [payload, translations] = await Promise.all([
    getResults(electionRef),
    serverSideTranslations(locale, ["resource"]),
  ]);

  if ("msg" in payload) {
    return {props: {err: payload.msg, ...translations}};
  }

  const numGrades = payload.grades.length;
  const grades = payload.grades.map((g, i) => ({...g, color: getGradeColor(i, numGrades)}));
  const gradesByValue: {[key: number]: GradeResultInterface} = {}
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
      meritProfile: payload.merit_profile[c.id],
      rank: payload.ranking[c.id] + 1,
      majorityGrade: gradesByValue[getMajorityGrade(payload.merit_profile[c.id])]
    })),
    ranking: payload.ranking,
    meritProfiles: payload.merit_profile,

  }
  console.log("GRADES", payload.grades, grades, result.grades)

  return {
    props: {
      result,
      token: token || "",
      ...translations,
    },
  };
}


const getNumVotes = (result: ResultInterface) => {
  const sum = (seq: MeritProfileInterface) =>
    Object.values(seq).reduce((a, b) => a + b, 0);
  const anyCandidateId = result.candidates[0].id;
  const numVotes = sum(result.meritProfiles[anyCandidateId]);
  Object.values(result.meritProfiles).forEach(v => {
    if (sum(v) !== numVotes) {
      throw Error("The election does not contain the same number of votes for each candidate")
    }
  })
  return numVotes;
}

const WillClose = ({delay}) => {
  const {t} = useTranslation();
  if (delay < 365) {
    return <div>{t('result.closed')}</div>
  }
  else if (delay < 0) {
    return <div>{`${t('result.has-closed')} ${delay} ${t('common.days')}`}</div>
  } else if (delay > 365) {
    return <div>{t('result.opened')}</div>
  } else {
    return <div>{`${t('result.will-close')} ${delay} ${t('common.days')}`}</div>
  }
}

interface ResultBanner {
  result: ResultInterface;
}
const ResultBanner = ({result}) => {
  const {t} = useTranslation();

  const dateEnd = new Date(result.dateEnd);
  const now = new Date();
  const closedSince = +dateEnd - (+now);

  const numVotes = getNumVotes(result)

  return (<div className="w-100 bg-white p-5 d-flex justify-content-between align-items-center">
    <div className="text-muted">
      <div className="d-flex align-items-center">
        <Image alt="Calendar" src={calendar} className="me-2" />
        <WillClose delay={closedSince} />
      </div>
      <div className="d-flex align-items-center" >
        <Image src={avatarBlue} alt="Avatar" className="me-2" />
        <div>{numVotes} {numVotes > 1 ? t('common.participants') : t('common.participant')}</div>
      </div>
    </div>

    <h4 className="text-black">{result.name}</h4>

    <div className="text-muted">
      <div className="d-flex align-items-center">
        <Image alt="Download" src={arrowUpload} className="me-2" />
        <div>{t('result.download')}</div>
      </div>
      <div className="d-flex align-items-center">
        <Image src={arrowLink} alt="Share" className="me-2" />
        <div>{t('result.share')}</div>
      </div>
    </div>
  </div >
  )
}


const BottomButtonsMobile = ({result}) => {
  const {t} = useTranslation();
  const values = result.grades.map(v => v.value).sort()
  //   const data = result.candidates.map(c => [c.name]);
  const data = result.candidates.map(c => {

    const grades = {}
    result.grades.forEach(g => grades[g.name] = g.value in c.meritProfile ? c.meritProfile[g.value].toString() : "0")
    return {name: c.name, ...grades}
  });
  console.log(data)

  return (
    <div className="d-block d-md-none mt-5" role="button">
      <CSVLink
        filename={`results-${displayRef(result.ref)}.csv`}
        data={data}>
        <Button className="cursorPointer btn-result btn-validation mb-5 btn btn-secondary">
          <Image alt="Download" src={arrowUpload} />
          <p>{t('result.download')}</p>
        </Button>
      </CSVLink>
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
  return <div className="m-3 d-flex flex-column justify-content-end align-items-center candidate_rank fw-bold">
    <div className={isFirst ? "text-primary bg-white fs-5 badge" : "text-white bg-secondary fs-6 badge"}>
      {candidate.rank}
    </div>
    <div className={`text-white my-2 ${isFirst ? "fs-4" : "fs-6"}`}>
      {candidate.name}
    </div>
    <ButtonGrade grade={candidate.majorityGrade} />
  </div>
}

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
        onClick={() => setCollapse(s => !s)}
      >
        <div className=" align-items-center d-flex">
          <span className="resultPositionCard me-2">{candidate.rank}</span>
          <span className="candidateName">
            {candidate.name}
          </span>
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
      <Collapse isOpen={!collapse} >
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
            <FontAwesomeIcon
              icon={faChevronRight}
              className="ms-3"
            />
          </a>
        </CardBody>
      </Collapse>
    </Card >
  )
};


interface PodiumInterface {
  candidates: Array<CandidateResultInterface>;
}


const Podium = ({candidates}: PodiumInterface) => {
  const {t} = useTranslation();

  // get best candidates
  const numBest = Math.min(3, candidates.length);
  const candidateByRank = {}
  candidates.filter(c => c.rank < 4).forEach(c => candidateByRank[c.rank] = c)

  if (numBest < 2) {
    throw Error("Can not load enough candidates");
  }

  if (numBest === 2) {
    return (<div className="d-md-flex my-5 justify-content-center d-none">
      <CandidateRanked candidate={candidateByRank[1]} />
      <CandidateRanked candidate={candidateByRank[2]} />
    </div>)
  }


  return (<div className="d-md-flex my-5 d-none justify-content-center">
    <CandidateRanked candidate={candidateByRank[2]} />
    <CandidateRanked candidate={candidateByRank[1]} />
    <CandidateRanked candidate={candidateByRank[3]} />
  </div>)
}

interface ErrorInterface {
  message: string;
}
interface ResultPageInterface {
  result?: ResultInterface;
  token?: string;
  err?: ErrorInterface;
}


const ResultPage = ({result, token, err}: ResultPageInterface) => {
  const {t} = useTranslation();
  const router = useRouter();


  if (err && err.message !== '') {
    return <ErrorMessage msg={err.message} />;
  }

  if (!result) {
    return <ErrorMessage msg="error.catch22" />;
  }


  if (typeof result.candidates === "undefined" || result.candidates.length === 0) {
    throw Error("No candidates were loaded in this election")
  }

  const candidateByRank = {}
  result.candidates.filter(c => c.rank < 4).forEach(c => candidateByRank[c.rank] = c)

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

        <Row className="mt-5">
          <Col>
            <h5 className="text-white">
              {t('result.details')}
            </h5>
            {Object.keys(candidateByRank).sort().map((rank, i) => {
              return (
                <CandidateCard candidate={candidateByRank[rank]} grades={result.grades} key={i} />
              );
            })}
          </Col>
        </Row>
        <BottomButtonsMobile result={result} />
      </section>
    </Container>
  );
};

export default ResultPage;

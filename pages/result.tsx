import {useEffect, useState} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import {Container, Collapse, Card, CardHeader, CardBody} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
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
  GradeResultInterface,
  ResultInterface,
  MeritProfileInterface,
  CandidateResultInterface,
} from '@services/type';
import {getUrl, RouteTypes} from '@services/routes';
import {getLocaleShort} from '@services/utils';
import avatarBlue from '../public/avatarBlue.svg';
import arrowUpload from '../public/arrowUpload.svg';
import arrowLink from '../public/arrowL.svg';
import {getGradeColor} from '@services/grades';
import {useRouter} from 'next/router';
import { MajorityJudgmentDeliberator, NormalizedTally, Proposal, Tally } from 'scalable-majority-judgment';

export async function getServerSideProps({query, locale}) {
  const translations = await serverSideTranslations(locale, ['resource']);

  try {
    if (!query.mentions)
      throw "\"mentions\" query param is missing";

    if (!query.candidatsAndResults)
      throw "\"candidatsAndResults\" query param is missing";

    const parsedMentions = JSON.parse(query.mentions);

    if (!Array.isArray(parsedMentions)) {
      throw "\"mentions\" query param is not an array";
    }

    if (parsedMentions.length < 2)
      throw "\"mentions\" query param must contain at least 2 elements";

    const mentions: string[] = parsedMentions.reverse();
    // TODO: check type
    const candidatsAndResults = JSON.parse(query.candidatsAndResults);

    if (!Array.isArray(candidatsAndResults)) {
      throw "\"candidatsAndResults\" query param is not an array of array";
    }

    if (candidatsAndResults.length < 2) {
      throw "\"candidatsAndResults\" query param must contain at least 2 elements";
    }

    candidatsAndResults.forEach((candidatAndResult) => {
      if (!Array.isArray(candidatAndResult)) {
        throw "\"candidatsAndResults\" query param is not an array of array";
      }

      candidatAndResult.slice(1).forEach((result) => {
        if (typeof result !== 'number' && typeof result !== 'bigint' && isNaN(Number(result))) {
          throw "\"candidatsAndResults\" result part contains a non-numeric value";
        }
      });
    });

    const grades = [];

    for (let i = 0; i < mentions.length; ++i) {
      grades.push({
        name: mentions[i],
        description:"",
        value: i,
        id:i,
        color:getGradeColor(i, mentions.length)
      });
    }

    const candidates:CandidateResultInterface[] = [];
    const voteCounts = candidatsAndResults.map((candidatAndResult) => {
      let voteCount = null;
      candidatAndResult.slice(1).forEach(c => {
        if (voteCount == null)
          voteCount = BigInt(c);
        else
          voteCount += BigInt(c);
      })

      return voteCount;
    });

    let maxVoteCount = BigInt(0);

    for (let i = 0; i < candidatsAndResults.length; ++i)
      if (voteCounts[i] > maxVoteCount)
        maxVoteCount = voteCounts[i];

    const tally = new NormalizedTally(candidatsAndResults.map(t => new Proposal(t.slice(1).map(v => BigInt(v)).reverse())));
    const deliberator = new MajorityJudgmentDeliberator();
    const r = deliberator.deliberate(tally);

    for (let i = 0; i < candidatsAndResults.length; ++i) {
      candidates.push({
        id : i,
        description : "",
        image : "",
        name : candidatsAndResults[i][0],
        rank : r.proposalResults[i].rank,
        majorityGrade : grades[r.proposalResults[i].analysis.medianMentionIndex],
        meritProfile : r.proposalResults[i].proposal.meritProfile.map(t => Number(t)),
      });
    }

    const result: ResultInterface = {
      name: "",
      description: "",
      ref: "",
      dateStart: "",
      dateEnd: "",
      hideResults: false,
      forceClose: false,
      restricted: false,
      grades: grades,
      candidates,
      voteCount:maxVoteCount.toString(),
      ranking: candidates.reduce((acc, candidate) => {
        acc[candidate.id] = candidate.rank;
        return acc;
      }, {} as Record<number, number>),
      meritProfiles: candidates.reduce((acc, candidate) => {
        acc[candidate.id] = candidate.meritProfile;
        return acc;
      }, {} as Record<number, MeritProfileInterface>),
    };

    return {
      props: {
        result,
        token: '',
        fromCSV: (query.fromCSV || false).toString() === 'true',
        ...translations,
      },
    };
  } catch (e) {
    return {props: {err: e.toString(), ...translations, fromCSV: (query.fromCSV || false).toString() === 'true'}};
  }
}

interface ElectionStatusProps {
  delay: number | null;
  forceClose: boolean;
}

interface ResultBanner {
  result: ResultInterface;
}
const ResultBanner = ({name, voteCount}:{name:string, voteCount:bigint}) => {
  const {t} = useTranslation();

  return (
    <>
      {
        // MOBILE
      }
      <div className="w-100 bg-white p-4 d-flex flex-column d-md-none justify-content-center align-items-start">
        <h4 className="text-black">{name}</h4>

        <div className="text-muted w-100 d-flex justify-content-between">
          <div className="d-flex align-items-center justify-content-end flex-fill">
            <Image src={avatarBlue} alt="Avatar" className="me-2" />
            <div>
              {voteCount.toString()}{' '}
              {voteCount > 1
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
            <Image src={avatarBlue} alt="Avatar" className="me-2" />
            <div>
              {voteCount.toString()}{' '}
              {voteCount > 1
                ? t('common.participants')
                : t('common.participant')}
            </div>
          </div>
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
      filename={`results.csv`}
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
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

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
          suppressHydrationWarning
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
          <Link href="/" suppressHydrationWarning>
            <Logo title={false} />
          </Link>
          <h5 className="m-1 flex-fill text-center">{name}</h5>
        </div>
        {token ? (
          <div className="d-flex">
            <Link href={getUrl(RouteTypes.ADMIN, locale, electionRef, token)} suppressHydrationWarning>
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
          <Link href="/" suppressHydrationWarning>
            <Logo height={38} title={true} />
          </Link>
          <h5 className="m-1 ms-5">{t('result.result')}</h5>
        </div>
        {token ? (
          <div className="d-flex">
            <Link href={getUrl(RouteTypes.ADMIN, locale, electionRef, token)} suppressHydrationWarning>
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
            suppressHydrationWarning
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
  err?: string;
  fromCSV:boolean;
  electionRef?: string;
}

const ResultPage = ({
  result,
  token,
  err,
  fromCSV,
  electionRef,
}: ResultPageInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  if (err) {
    let errorMessage;

    if (fromCSV) {
      errorMessage = t("error.wrong-csv-format");
    } else {
      if (err.indexOf("JSON") != -1)
        errorMessage = "Fail to parse json from query params";
      else
        errorMessage = err;
    }

    return (
      <ErrorMessage>
        {
          <>
            <p>{errorMessage}</p>
          </>
        }
      </ErrorMessage>
    );
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
      <ResultBanner voteCount={BigInt(result.voteCount)} name={result.name} />

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

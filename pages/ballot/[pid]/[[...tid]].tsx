import {useState, useCallback, useEffect, MouseEvent} from 'react';
import Image from 'next/image';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Col, Row, Container} from 'reactstrap';
// import {toast, ToastContainer} from "react-toastify";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendarDays, faCheck} from '@fortawesome/free-solid-svg-icons';
import {getElection, castBallot, apiErrors, ElectionPayload, CandidatePayload, GradePayload} from '@services/api';
import Button from '@components/Button';
import useEmblaCarousel from 'embla-carousel-react';
import {DotButton} from '@components/admin/EmblaCarouselButtons';
import {getGradeColor} from '@services/grades';
import {useBallot, BallotTypes, BallotProvider} from '@services/BallotContext';
import {getLocaleShort} from '@services/utils';
import {ENDED_VOTE} from '@services/routes';
import defaultAvatar from '../../../public/avatarBlue.svg';


const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export async function getServerSideProps({query: {pid, tid}, locale}) {
  if (!pid) {
    return {notFound: true}
  }

  const [election, translations] = await Promise.all([
    getElection(pid),
    serverSideTranslations(locale, ['resource']),
  ]);

  if (typeof election === 'string' || election instanceof String) {
    return {notFound: true}
  }

  const dateEnd = new Date(election.date_end)
  if (dateEnd.getDate() > new Date().getDate()) {
    return {
      redirect: ENDED_VOTE,
      permanent: false
    }
  }

  if (!election || !election.candidates || !Array.isArray(election.candidates)) {
    console.log(election);
    return {notFound: true}
  }

  const description = JSON.parse(election.description);

  if (description.randomOrder) {
    shuffle(election.candidates);
  }

  return {
    props: {
      ...translations,
      election,
      pid: pid,
      token: tid || null,
    },
  };
}

interface TitleBarInterface {
  election: ElectionPayload;
}
const TitleBar = ({election}: TitleBarInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <div className="w-100 bg-light p-2 text-black justify-content-center d-flex ">
      <div className="me-2">
        <FontAwesomeIcon icon={faCalendarDays} />
      </div>
      <div>
        {` ${t("vote.open-until")}   ${new Date(election.date_end).toLocaleDateString(locale, {dateStyle: "long"})}`}
      </div>
    </div>
  )
};

interface CandidateCardInterface {
  candidate: CandidatePayload;
}
const CandidateCard = ({candidate}: CandidateCardInterface) => {
  const {t} = useTranslation();
  return (<div className="d-flex align-items-center">
    <Image
      src={defaultAvatar}
      width={32}
      height={32}
      className="bg-light"
      alt={t('common.thumbnail')}
    />
    <div className="d-flex lh-sm flex-column justify-content-center ps-3">
      <span className="text-black fs-5 m-0 ">{candidate.name}</span>
      <br />
      <span className="text-muted fs-6 m-0 fw-normal">{t("vote.more-details")}</span>
    </div>
  </div>)
}


interface GradeInputInterface {
  gradeId: number;
  candidateId: number;
}
const GradeInput = ({gradeId, candidateId}: GradeInputInterface) => {
  const [ballot, dispatch] = useBallot();
  if (!ballot) {throw Error("Ensure the election is loaded")}

  const grade = ballot.election.grades[gradeId];
  const numGrades = ballot.election.grades.length;
  const color = getGradeColor(gradeId, numGrades);

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    dispatch({type: BallotTypes.VOTE, candidateId: candidateId, gradeId: gradeId})
  };

  const active = ballot.votes.some(b => b.gradeId === gradeId && b.candidateId === candidateId)

  return (
    <div
      className="text-lg-center my-1 voteCheck"

      onClick={handleClick}
    >
      <small
        className="nowrap d-lg-none bold badge"
        style={
          active
            ? {
              backgroundColor: color,
              color: '#fff',
            }
            : {
              backgroundColor: 'transparent',
              color: '#000',
            }
        }
      >
        {grade.name}
      </small>
      <span
        className="checkmark candidateGrade fs-6"
        style={
          active
            ? {
              backgroundColor: color,
              color: '#fff',
            }
            : {
              backgroundColor: '#C3BFD8',
              color: '#000',
            }
        }
      >
        { /*<small
          className="nowrap bold badge"
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
          }}
        >*/}
        {grade.name}
        { /*</small>*/}
      </span>
    </div>
  )
}

interface VoteInterface {
  election: ElectionPayload;
  err: string;
  token?: string;
}
const VoteBallot = ({election, token}: VoteInterface) => {
  const {t} = useTranslation();

  const router = useRouter();
  const [ballot, dispatch] = useBallot();

  useEffect(() => {
    dispatch({
      type: BallotTypes.ELECTION,
      election: election,
    });
  }, []);

  if (!ballot.election) {
    return <div>"Loading..."</div>;
  }

  const numGrades = ballot.election.grades.length;
  const disabled = ballot.votes.length !== ballot.election.candidates.length;
  const colSizeCandidateLg = 4;
  const colSizeCandidateMd = 6;
  const colSizeCandidateXs = 12;
  const colSizeGradeLg = Math.floor((12 - colSizeCandidateLg) / numGrades);
  const colSizeGradeMd = Math.floor((12 - colSizeCandidateMd) / numGrades);
  const colSizeGradeXs = Math.floor((12 - colSizeCandidateXs) / numGrades);

  const handleSubmitWithoutAllRate = () => {
    alert(t('You have to judge every candidate/proposal!'));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // const gradesById = {};
    // judgments.forEach((c) => {
    //   gradesById[c.id] = c.value;
    // });
    // const gradesByCandidate = [];
    // Object.keys(gradesById).forEach((id) => {
    //   gradesByCandidate.push(gradesById[id]);
    // });

    // castBallot(gradesByCandidate, election.id.toString(), token, () => {
    router.push(`/confirm/${election.id}`);
    // });
  };

  // const [viewportRef, embla] = useEmblaCarousel({skipSnaps: false});
  // const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  // const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const [scrollSnaps, setScrollSnaps] = useState([]);

  // const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  // const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  // const scrollTo = useCallback(
  //   (index) => embla && embla.scrollTo(index),
  //   [embla]
  // );

  // const onSelect = useCallback(() => {
  //   if (!embla) return;
  //   setSelectedIndex(embla.selectedScrollSnap());
  //   setPrevBtnEnabled(embla.canScrollPrev());
  //   setNextBtnEnabled(embla.canScrollNext());
  // }, [embla, setSelectedIndex]);

  // useEffect(() => {
  //   if (!embla) return;
  //   onSelect();
  //   setScrollSnaps(embla.scrollSnapList());
  //   embla.on('select', onSelect);
  // }, [embla, setScrollSnaps, onSelect]);

  return (
    <>
      <Head>
        <title>{election.name}</title>

        <meta key="og:title" property="og:title" content={election.name} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>

      <TitleBar election={ballot.election} />
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-5">{election.name}</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          {election.candidates.map((candidate, candidateId) => {
            return (
              <div key={candidateId} className="bg-white justify-content-between d-flex my-4 py-2 px-3">
                <CandidateCard candidate={candidate} />
                <div className="cardVoteGrades">
                  {election.grades.map((_, gradeId) => {
                    console.assert(gradeId < numGrades);
                    return (
                      <GradeInput key={gradeId} gradeId={gradeId} candidateId={candidateId} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </form >
      </div >
      <Container className="my-5 d-md-flex d-grid justify-content-md-center">
        <Button
          outline={true}
          color="secondary"
          className="bg-blue"
          onClick={handleSubmit}
          disabled={disabled}
          icon={faCheck}
          position="left"
        >
          {t('vote.submit')}
        </Button>
      </Container>
    </>
  );
};

const Ballot = (props) => {

  return (<BallotProvider>
    <VoteBallot {...props} />

  </BallotProvider>)
}

export default Ballot;

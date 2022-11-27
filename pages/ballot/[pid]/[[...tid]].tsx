import {useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {getElection, castBallot, apiErrors, ElectionPayload, CandidatePayload, GradePayload} from '@services/api';
import BallotDesktop from '@components/ballot/BallotDesktop'
import BallotMobile from '@components/ballot/BallotMobile'
import {useBallot, BallotTypes, BallotProvider} from '@services/BallotContext';
import {ENDED_VOTE} from '@services/routes';


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
    <form className="w-100 h-100" onSubmit={handleSubmit} autoComplete="off">
      <Head>
        <title>{election.name}</title>

        <meta key="og:title" property="og:title" content={election.name} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>

      <BallotDesktop />
      <BallotMobile />
    </form >
  );
};

const Ballot = (props) => {

  return (<BallotProvider>
    <VoteBallot {...props} />

  </BallotProvider>)
}

export default Ballot;

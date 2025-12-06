import {useEffect, useState} from 'react';
import Head from 'next/head';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Container} from 'reactstrap';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import BallotDesktop from '@components/ballot/BallotDesktop';
import Button from '@components/Button';
import BallotMobile from '@components/ballot/BallotMobile';
import Blur from '@components/Blur';
import {
  getElection,
  getBallot,
  castBallot,
  ElectionPayload,
  BallotPayload,
  ErrorPayload,
  ELECTION_FINISHED_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  WRONG_ELECTION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  ELECTION_NOT_STARTED_ERROR_CODE,
} from '@services/api';
import {
  useBallot,
  BallotTypes,
  BallotProvider,
} from '@services/BallotContext';
import {getUrl, RouteTypes} from '@services/routes';
import {getLocaleShort, isEnded} from '@services/utils';
import WaitingBallot from '@components/WaitingBallot';
import PatternedBackground from '@components/PatternedBackground';
import {useRouter} from 'next/router';
import ErrorDisplay from '@components/ErrorDisplay';
import TitleBar from '@components/ballot/TitleBar';

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export async function getServerSideProps({query: {pid, tid}, locale}) {
  if (!pid) {
    return {notFound: true};
  }
  const electionRef = pid.replaceAll('-', '');

  const [election, ballot, translations] = await Promise.all([
    getElection(electionRef),
    tid ? getBallot(tid) : null,
    serverSideTranslations(locale, ['resource']),
  ]);

  if ('message' in election) {
    return {notFound: true};
  }

  if (isEnded(election.date_end) || election.force_close) {
    const url = getUrl(RouteTypes.ENDED_VOTE, locale, electionRef)
    return {
      redirect: {
        destination: url.toString(),
        permanent: false,
      },
    };
  }

  if (
    !election ||
    !election.candidates ||
    !Array.isArray(election.candidates)
  ) {
    return {notFound: true};
  }

  const description = JSON.parse(election.description);

  if (description.randomOrder) {
    shuffle(election.candidates);
  }

  return {
    props: {
      ...translations,
      election,
      electionRef,
      token: tid || null,
      previousBallot: ballot && !('error' in ballot) ? ballot : null,
    },
  };
}

const ButtonSubmit = () => {
  const {t} = useTranslation();

  const [ballot] = useBallot();
  const disabled = ballot.votes.length !== ballot.election.candidates.length;
  return (
    <Container className="my-5 d-md-flex d-grid justify-content-md-center">
      <Button
        outline={true}
        color="secondary"
        className="bg-blue"
        role="submit"
        disabled={disabled}
        icon={faCheck}
        position="left"
      >
        {t('vote.submit')}
      </Button>
    </Container>
  );
};

interface VoteInterface {
  election: ElectionPayload;
  electionRef: string;
  err: string;
  token?: string;
  previousBallot: BallotPayload
}
const VoteBallot = ({election, electionRef, token, previousBallot}: VoteInterface) => {
  const {t} = useTranslation();

  const [ballot, dispatch] = useBallot();
  const router = useRouter();

  const [voting, setVoting] = useState(false);
  const [payload, setPayload] = useState<BallotPayload | null>(null);
  const [error, setError] = useState<ErrorPayload | null>(null);


  useEffect(() => {
    dispatch({
      type: BallotTypes.ELECTION,
      election: election,
    });
  }, []);

  if (!ballot.election) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setVoting(true);

    try {
      const res = await castBallot(ballot.votes, ballot.election, token);
      if (res.status !== 200) {
        console.error(res);
        const errorPayload: ErrorPayload = await res.json();
        setError(errorPayload);
      } else {
        const msg: BallotPayload = await res.json();
        setPayload(msg);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (election.restricted && !token) {
    const locale = getLocaleShort(router);
    const url = getUrl(RouteTypes.RESTRICTED_VOTE, locale)
    router.push(url);
  }

  if (voting) {
    if (error) {
      const locale = getLocaleShort(router);

      if (error.error === ELECTION_FINISHED_ERROR_CODE) {
        const url = getUrl(RouteTypes.ENDED_VOTE, locale, electionRef);
        return <ErrorDisplay
          title={t('vote.error-closed-title')}
          message={t('vote.error-closed-message')}
          buttonText={t('vote.go-to-results')}
          onButtonClick={() => router.push(url.toString())}
        />;
      } else if (error.error === ELECTION_NOT_STARTED_ERROR_CODE) {
        return <ErrorDisplay
          title={t('vote.error-not-started-title')}
          message={t('vote.error-not-started-message')}
          buttonText={t('common.go-home', 'Go to Homepage')}
          onButtonClick={() => router.push('/')}
        />;
      } else if (
          error.error === UNAUTHORIZED_ERROR_CODE ||
          error.error === WRONG_ELECTION_ERROR_CODE ||
          error.error === NOT_FOUND_ERROR_CODE
      ) {
        // These errors strongly suggest the user's link/token is bad.
        return <ErrorDisplay
          title={t('vote.error-invalid-link-title')}
          message={t('vote.error-invalid-link-message')}
          buttonText={t('common.back-homepage')}
          onButtonClick={() => router.push('/')}
        />;
      } else {
        return <ErrorDisplay
          title={t('vote.error-generic-title')}
          message={t('vote.error-generic-message')}
          buttonText={t('common.reload')}
          onButtonClick={() => router.reload()}
        />;
      }
    }
    return (
      <PatternedBackground>
        <WaitingBallot ballot={payload} error={error} />
      </PatternedBackground>
    );
  }

  return (
    <><TitleBar election={ballot.election} />

      <Head>
        <title>{election.name}</title>

        <meta key="og:title" property="og:title" content={election.name} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>
      <form
        className="w-100  flex-fill d-flex align-items-center"
        onSubmit={handleSubmit}
        autoComplete="off"
      >

        <Blur />
        <div className="w-100 h-100 d-flex flex-column justify-content-center">
          <BallotDesktop hasVoted={previousBallot != null} />
          <BallotMobile hasVoted={previousBallot != null} />
          <ButtonSubmit />
        </div>
      </form>
    </>
  );
};

const Ballot = (props) => {
  return (
    <BallotProvider>
      <VoteBallot {...props} />
    </BallotProvider>
  );
};

export default Ballot;

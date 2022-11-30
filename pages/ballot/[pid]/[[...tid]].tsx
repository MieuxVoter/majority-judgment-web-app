import {useEffect, useState} from 'react';
import Head from 'next/head';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {getElection, castBallot, ElectionPayload, BallotPayload, ErrorPayload} from '@services/api';
import BallotDesktop from '@components/ballot/BallotDesktop'
import BallotMobile from '@components/ballot/BallotMobile'
import Blur from '@components/Blur'
import {useBallot, BallotTypes, BallotProvider} from '@services/BallotContext';
import {ENDED_VOTE} from '@services/routes';
import WaitingBallot from '@components/WaitingBallot';
import PatternedBackground from '@components/PatternedBackground';


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

  const [ballot, dispatch] = useBallot();

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
    return <div>"Loading..."</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setVoting(true);

    try {
      const res = await castBallot(
        ballot.votes,
        ballot.election.ref, ballot.election.restricted, token)
      if (res.status !== 200) {
        console.error(res);
        const msg = await res.json();
        setError(msg)
      }
      else {
        const msg = await res.json();
        setPayload(msg)
      }
    } catch (err) {
      console.error(err);
      setError(err.message)
    }
  };

  if (voting) {
    return <PatternedBackground>
      <WaitingBallot ballot={payload} error={error} />
    </PatternedBackground>
  }

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

      <Blur />
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

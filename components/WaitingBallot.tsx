import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {CSSProperties, useEffect, useState} from 'react';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Container} from 'reactstrap';
import Button from '@components/Button';
import ButtonCopy from '@components/ButtonCopy';
import Share from '@components/Share';
import ErrorMessage from '@components/Error';
import AdminModalEmail from '@components/admin/AdminModalEmail';
import {BallotPayload, ErrorPayload} from '@services/api';
import {useAppContext} from '@services/context';
import {getUrlResults} from '@services/routes';
import urne from '../public/urne.svg'
import star from '../public/star.svg'
import Logo from './Logo';
import {FORM_FEEDBACK} from '@services/constants';


export interface WaitingBallotInterface {
  ballot?: BallotPayload;
  error?: ErrorPayload;
}

const ButtonResults = ({election}) => {
  const {t} = useTranslation();

  const dateEnd = new Date(election.date_end);
  const now = new Date();
  const isEnded = +dateEnd > +now;

  if (!election.hideResults || isEnded) {
    return (
      <Button className="" icon={faArrowRight} position="right">
        {t('vote.go-to-results')}
      </Button>
    )
  } else {
    return null;
  }
}


const DiscoverMajorityJudgment = () => {
  const {t} = useTranslation();
  return (
    <div className="bg-secondary h-100 p-4 text-white me-3">
      <h5>{t('vote.discover-mj')}</h5>
      <p>{t('vote.discover-mj-desc')}</p>
      <a href="https://mieuxvoter.fr/le-jugement-majoritaire">
        <div className="d-flex">
          <div className="me-2">{t('common.about')}</div>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    </div>)
}

const SupportBetterVote = () => {
  const {t} = useTranslation();
  return (
    <div className="text-secondary h-100 p-4 bg-white">
      <div className="d-flex justify-content-between">
        <h5>{t('vote.support-better-vote')}</h5>
        <Logo title={false} />
      </div>
      <p>{t('vote.support-desc')}</p>
      <a href="https://mieuxvoter.fr/le-jugement-majoritaire">
        <div className="d-flex">
          <div className="me-2">{t('common.donation')}</div>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    </div>)
}


const Thanks = () => {
  const {t} = useTranslation();
  return (<>
    <h5>{t('vote.thanks')}</h5>
    <p>{t('vote.form-desc')}</p>
    <a href={FORM_FEEDBACK} target="_blank"
      rel="noopener noreferrer"
    >
      <Button color="secondary" outline={true}>
        {t('vote.form')}
      </Button>
    </a>
  </>)
}

interface InfoInterface extends WaitingBallotInterface {
  display: string;
}


const Info = ({ballot, error, display}: InfoInterface) => {
  const {t} = useTranslation();

  if (!ballot) return null;

  if (error) {
    return <ErrorMessage msg={error.detail[0].msg} />
  }

  return (
    <div style={{
      display: display,
      transition: "display 2s",
    }}
      className="d-flex flex-column align-items-center"
    >
      <h4 className="text-center">
        {t('vote.success-ballot')}
      </h4>

      <ButtonResults election={ballot.election} />
      <Container className="d-flex m-4 justify-content-between">
        <DiscoverMajorityJudgment />
        <SupportBetterVote />
      </Container>
      <Thanks />
      <Share />
    </div >
  )
}

export default ({ballot, error}: WaitingBallotInterface) => {
  const {setApp} = useAppContext();

  const [urneProperties, setUrne] = useState<CSSProperties>({width: 0, height: 0, marginBottom: 0});
  const [starProperties, setStar] = useState<CSSProperties>({width: 0, height: 0, marginLeft: 100, marginBottom: 0});
  const [urneContainerProperties, setUrneContainer] = useState<CSSProperties>({height: "100vh"});
  const [ballotProperties, setBallot] = useState<CSSProperties>({display: "none"});


  useEffect(() => {
    setApp({footer: false});

    setUrne(urne => ({
      ...urne,
      width: 300,
      height: 300,
    }));

    const timer = setTimeout(() => {
      setStar(star => ({
        ...star,
        width: 150,
        height: 150,
        marginLeft: 150,
        marginBottom: 300,
      }
      ));
    }, 1000);

    const timer2 = setTimeout(() => {
      // setBallot({display: "block"});
      setUrneContainer(urneContainer => ({
        ...urneContainer,
        height: "50vh",
      }));
      setStar(star => ({
        ...star,
        width: 100,
        height: 100,
        marginLeft: 100,
        marginBottom: 200,
      }));
      setUrne(urne => ({
        ...urne,
        width: 200,
        height: 200,
      }));
    }, 3000);

    const timer3 = setTimeout(() => {
      setBallot({display: "grid"});
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };

  }, [])



  return (<Container
    className="d-flex h-100 w-100 align-items-center flex-column"
  >
    <div
      style={{
        transition: "width 2s, height 2s",
        height: urneContainerProperties.height,
      }}
      className="d-flex align-items-center"
    >
      <div
        className="position-relative"
        style={{
          transition: "width 2s, height 2s, margin-bottom 2s",
          zIndex: 2,
          marginTop: urneProperties.marginBottom,
          height: urneProperties.height,
          width: urneProperties.width,
        }}
      >
        <Image
          src={urne}
          alt="urne"
          fill={true}
        />
      </div>
      <div
        className="position-absolute"
        style={{
          transition: "width 2s, height 2s, margin-left 2s, margin-bottom 2s",
          marginLeft: starProperties.marginLeft,
          marginBottom: starProperties.marginBottom,
          height: starProperties.height,
          width: starProperties.width,
        }}
      >
        <Image
          src={star}
          fill={true}
          alt="urne"
        />
      </div>
    </div>
    <Info ballot={ballot} error={error} display={ballotProperties.display} />
  </Container >)
}

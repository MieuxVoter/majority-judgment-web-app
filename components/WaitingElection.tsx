import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {CSSProperties, useEffect, useState} from 'react';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@components/Button';
import ButtonCopy from '@components/ButtonCopy';
import Share from '@components/Share';
import ErrorMessage from '@components/Error';
import AdminModalEmail from '@components/admin/AdminModalEmail';
import {ElectionCreatedPayload, ErrorPayload} from '@services/api';
import {AppTypes, useAppContext} from '@services/context';
import {getUrl, RouteTypes} from '@services/routes';
import urne from '../public/urne.svg';
import star from '../public/star.svg';
import {Container} from 'reactstrap';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';

export interface WaitingBallotInterface {
  election?: ElectionCreatedPayload;
  error?: ErrorPayload;
}

interface InfoElectionInterface extends WaitingBallotInterface {
  display: string;
}

const InfoElection = ({election, error, display}: InfoElectionInterface) => {
  const {t} = useTranslation();
  const router = useRouter();

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal((m) => !m);

  if (!election && !error) return null;

  const locale = getLocaleShort(router);

  return (
    <div
      style={{
        display: display,
        transition: 'display 2s',
      }}
    >
      <div className="d-flex flex-column align-items-center">
        {/* --- ERROR STATE --- */}
        {error && (
          <>
            <h4 className="text-center">{t('error.title')}</h4>
            <ErrorMessage>{error.message || t('error.catch22')}</ErrorMessage>
            <div className="d-grid w-100 mt-3">
              <Button
                color="info"
                outline={false}
                onClick={() => router.back()} // Go back to the previous page
                className="border-dark border-4 py-3"
              >
                {t('common.go-back')}
              </Button>
            </div>
          </>
        )}

        {/* --- SUCCESS STATE --- */}
        {election && election.ref && (
          <>
            <h4 className="text-center">{t('admin.success-election')}</h4>

            {election.restricted ? (
              <h5 className="text-center">{t('admin.success-emails')}</h5>
            ) : (
              <div className="d-grid w-100">
                <ButtonCopy
                  text={t('admin.success-copy-vote')}
                  content={getUrl(RouteTypes.VOTE, locale, election.ref)}
                />
                <ButtonCopy
                  text={t('admin.success-copy-result')}
                  content={getUrl(RouteTypes.RESULTS, locale, election.ref)}
                />
              </div>
            )}
            <div className="d-grid w-100">
              <Button
                icon={faArrowRight}
                position="right"
                color="info"
                outline={false}
                onClick={toggleModal}
                className="border-dark border-4 mt-3 py-3"
              >
                {t('admin.go-to-admin')}
              </Button>
            </div>
            <Share title={t('common.share-short')} />
            <AdminModalEmail
              toggle={toggleModal}
              isOpen={modal}
              electionRef={election.ref}
              adminToken={election.admin}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ({election, error}: WaitingBallotInterface) => {
  const [_, dispatch] = useAppContext();

  const [urneProperties, setUrne] = useState<CSSProperties>({
    width: 0,
    height: 0,
    marginBottom: 0,
  });
  const [starProperties, setStar] = useState<CSSProperties>({
    width: 0,
    height: 0,
    marginLeft: 100,
    marginBottom: 0,
  });
  const [urneContainerProperties, setUrneContainer] = useState<CSSProperties>({
    height: '100vh',
  });
  const [electionProperties, setElection] = useState<CSSProperties>({
    display: 'none',
  });

  useEffect(() => {
    dispatch({type: AppTypes.FULLPAGE, value: true});

    setUrne((urne) => ({
      ...urne,
      width: 300,
      height: 300,
    }));

    const timer = setTimeout(() => {
      setStar((star) => ({
        ...star,
        width: 150,
        height: 150,
        marginLeft: 150,
        marginBottom: 300,
      }));
    }, 1000);

    const timer2 = setTimeout(() => {
      // setElection({display: "block"});
      setUrneContainer((urneContainer) => ({
        ...urneContainer,
        height: '50vh',
      }));
      setStar((star) => ({
        ...star,
        width: 100,
        height: 100,
        marginLeft: 100,
        marginBottom: 200,
      }));
      setUrne((urne) => ({
        ...urne,
        width: 200,
        height: 200,
      }));
    }, 3000);

    const timer3 = setTimeout(() => {
      setElection({display: 'grid'});
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <Container
      className="d-flex h-100 w-100 align-items-center flex-column"
      style={{
        maxWidth: '400px',
      }}
    >
      <div
        style={{
          transition: 'width 2s, height 2s',
          height: urneContainerProperties.height,
        }}
        className="d-flex align-items-center"
      >
        <div
          className="position-relative"
          style={{
            transition: 'width 2s, height 2s, margin-bottom 2s',
            zIndex: 2,
            marginTop: urneProperties.marginBottom,
            height: urneProperties.height,
            width: urneProperties.width,
          }}
        >
          <Image src={urne} alt="urne" fill={true} />
        </div>
        <div
          className="position-absolute"
          style={{
            transition: 'width 2s, height 2s, margin-left 2s, margin-bottom 2s',
            marginLeft: starProperties.marginLeft,
            marginBottom: starProperties.marginBottom,
            height: starProperties.height,
            width: starProperties.width,
          }}
        >
          <Image src={star} fill={true} alt="urne" />
        </div>
      </div>
      <InfoElection
        election={election}
        error={error}
        display={electionProperties.display}
      />
    </Container>
  );
};

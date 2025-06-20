import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col } from 'reactstrap';
import {
  faArrowRight,
  faCheck,
  faCheckToSlot,
  faFloppyDisk,
  faSquarePollVertical,
  faSquareXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getElection,
  updateElection,
  closeElection,
  getProgress,
  openElection,
} from '@services/api';
import {
  ElectionContextInterface,
  ElectionProvider,
  ElectionTypes,
  useElection,
  isClosed,
  canViewResults,
  checkName,
  hasEnoughGrades,
  hasEnoughCandidates,
  canBeFinished,
} from '@services/ElectionContext';
import { CandidateItem, GradeItem } from '@services/type';
import { gradeColors } from '@services/grades';
import TitleField from '@components/admin/Title';
import Button from '@components/Button';
import AccessResults from '@components/admin/AccessResults';
import CandidatesConfirmField from '@components/admin/CandidatesConfirmField';
import LimitDate from '@components/admin/LimitDate';
import Grades from '@components/admin/Grades';
import Order from '@components/admin/Order';
import Private from '@components/admin/Private';
import ErrorMessage from '@components/Error';
import Blur from '@components/Blur';
import { getUrl, RouteTypes } from '@services/routes';
import { sendInviteMails } from '@services/mail';
import { AppTypes, useAppContext } from '@services/context';
import { getLocaleShort, getTotalInvites, sendEmailsDownloadQRCodesPDFAndDisplayInvites, showGeneratedUrlsInNewTab } from '@services/utils';
import { generateQRCodesPDF } from '@services/qrcode';
import ResultForAdminOnlyParam from '@components/admin/ResultForAdminOnlyParam';

export async function getServerSideProps({ query, locale }) {
  const { pid, tid: token } = query;
  const electionRef = pid.replaceAll('-', '');

  const [payload, translations, progress] = await Promise.all([
    getElection(electionRef),
    serverSideTranslations(locale, ['resource']),
    getProgress(electionRef, token),
  ]);

  if ('message' in payload) {
    return { props: { err: payload.message, ...translations } };
  }

  if ('message' in progress) {
    return { props: { err: progress.message, ...translations } };
  }

  const grades = payload.grades.map((g) => ({ ...g, active: true }));

  const candidates: Array<CandidateItem> = payload.candidates.map((c) => ({
    ...c,
    active: true,
  }));
  const description = JSON.parse(payload.description);
  const randomOrder = description.randomOrder;

  const context: ElectionContextInterface = {
    name: payload.name,
    description: description.description,
    ref: payload.ref,
    dateStart: payload.date_start,
    dateEnd: payload.date_end,
    hideResults: payload.hide_results,
    forceClose: payload.force_close,
    restricted: payload.restricted,
    authForResult: payload.auth_for_result ?? false,
    numVoters: progress.num_voters ?? null,
    numVoted: progress.num_voters_voted ?? null,
    randomOrder,
    qrCodeCount:0,
    urlCount: 0,
    emails: [],
    grades,
    candidates,
  };

  return {
    props: {
      context,
      token: token || '',
      ...translations,
    },
  };
}

const Spinner = () => {
  return (
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

const ManageButtonsMobile = ({ handleClosing, waiting }) => {
  const { t } = useTranslation();
  const [election, _] = useElection();
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <>
      {!election.restricted && !isClosed(election) && (
        <Link
          href={getUrl(RouteTypes.VOTE, locale, election.ref)}
          className="d-grid"
        >
          <Button
            icon={faArrowRight}
            color="primary"
            style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
            position="right"
          >
            {t('admin.go-to-vote')}
          </Button>
        </Link>
      )}

      {canViewResults(election) && (
        <Link
          href={getUrl(RouteTypes.RESULTS, locale, election.ref)}
          className="d-grid"
        >
          <Button
            icon={faSquarePollVertical}
            color="primary"
            style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
            position="right"
          >
            {t('admin.go-to-result')}
          </Button>
        </Link>
      )}

      {!isClosed(election) && (
        <Button
          className="d-grid btn_closing"
          style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
          onClick={handleClosing}
          position="right"
        >
          {waiting ? <Spinner /> : t('admin.close-election')}
        </Button>
      )}
    </>
  );
};
const HeaderRubbonDesktop = ({
  handleClosing,
  handleOpening,
  handleSubmit,
  waiting,
  token
}) => {
  const { t } = useTranslation();
  const [election, _] = useElection();
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <div className="w-100 p-4 bg-primary text-white d-flex justify-content-between align-items-center">
      <h5 className="mx-0">{t('admin.admin-title')}</h5>

      <div className="d-flex">
        <Button
          icon={faFloppyDisk}
          color="primary"
          className="me-3"
          onClick={handleSubmit}
          style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
          position="right"
        >
          {t('common.save')}
        </Button>
        {!election.restricted && !isClosed(election) && (
          <Link href={getUrl(RouteTypes.VOTE, locale, election.ref)}>
            <Button
              icon={faCheckToSlot}
              color="primary"
              className="me-3"
              style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
              position="right"
            >
              {t('common.vote')}
            </Button>
          </Link>
        )}

        {canViewResults(election) && (
          <Link href={getUrl(RouteTypes.RESULTS, locale, election.ref, token)}>
            <Button
              icon={faSquarePollVertical}
              color="primary"
              className="me-3"
              style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
              position="right"
            >
              {t('common.results')}
            </Button>
          </Link>
        )}

        {isClosed(election) ? (
          <Button
            className="me-3"
            color="primary"
            style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
            onClick={handleOpening}
            icon={faSquareXmark}
            position="right"
          >
            {waiting ? <Spinner /> : t('admin.open-election')}
          </Button>
        ) : (
          <Button
            className="me-3"
            color="primary"
            style={{ border: '2px solid rgba(255, 255, 255, 0.4)' }}
            onClick={handleClosing}
            icon={faCheck}
            position="right"
          >
            {waiting ? <Spinner /> : t('admin.close-election')}
          </Button>
        )}
      </div>
    </div>
  );
};

const HeaderRubbonMobile = () => {
  const { t } = useTranslation();
  return (
    <div
      className="w-100 px-4 text-white d-flex justify-content-between align-items-center"
      style={{ minHeight: '100px' }}
    >
      <h5 className="mx-0 text-white">{t('admin.admin-title')}</h5>
    </div>
  );
};

const ManageElection = ({ token }:{token:(string|undefined)}) => {
  const { t } = useTranslation();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);

  const handleSubmit = async () => {
    if (!checkName(election)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.uncorrect-name'),
      });
      return;
    }

    if (!hasEnoughGrades(election)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.not-enough-grades'),
      });
      return;
    }

    if (!hasEnoughCandidates(election)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.not-enough-candidates'),
      });
      return;
    }

    if (!canBeFinished(election)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.cant-be-finished'),
      });
      return;
    }

    const candidates = election.candidates
      .filter((c) => c.active)
      .map((c: CandidateItem) => ({
        name: c.name,
        description: c.description,
        image: c.image,
        id: c.id,
      }));
    const grades = election.grades
      .filter((c) => c.active)
      .map((g: GradeItem) => ({ name: g.name, value: g.value, id: g.id }));
    setWaiting(true);

    const response = await updateElection(
      election.ref,
      election.name,
      candidates,
      grades,
      election.description,
      election.dateEnd,
      getTotalInvites(election),
      election.hideResults,
      election.forceClose,
      election.restricted,
      election.randomOrder,
      election.authForResult,
      token
    );

    if (response.status === 200 && 'ref' in response) {
      try {
        await sendEmailsDownloadQRCodesPDFAndDisplayInvites({
          electionName: election.name,
          emails: election.emails,
          qrCodeCount: election.qrCodeCount,
          urlCount: election.urlCount,
          invites: response.invites,
          ref: response.ref,
          router,
        });

        // Remove emails
        dispatch({
          type: ElectionTypes.SET,
          field: 'emails',
          value: [],
        });

        dispatch({
          type: ElectionTypes.SET,
          field: 'qrCodeCount',
          value: 0,
        });

        dispatch({
          type: ElectionTypes.SET,
          field: 'urlCount',
          value: 0,
        });

        setWaiting(false);

        dispatchApp({
          type: AppTypes.TOAST_ADD,
          status: 'success',
          message: t('success.election-updated'),
        });
      } catch (err) {
        dispatchApp({
          type: AppTypes.TOAST_ADD,
          status: 'error',
          message: t('error.catch22'),
        });
        console.error(err);
      }      
    } else {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.catch22'),
      });
    }
  } 

  /**
   * Open an election
   */
  const handleOpening = async () => {
    setWaiting(true);
    try {
      const response = await openElection(election, token);

      if (response.status === 200 && 'ref' in response) {
        dispatchApp({
          type: AppTypes.TOAST_ADD,
          status: 'success',
          message: t('success.election-opened'),
        });
        dispatch({
          type: ElectionTypes.SET,
          field: 'forceClose',
          value: false,
        });

        router.reload();
      }
    } catch {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.catch22'),
      });
    } finally {
      setWaiting(false);
    }
  };

  /**
   * Close an election
   */
  const handleClosing = async () => {
    setWaiting(true);
    const response = await closeElection(election.ref, token);
    if (response.status === 200 && 'ref' in response) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'success',
        message: t('success.election-closed'),
      });
      dispatch({
        type: ElectionTypes.SET,
        field: 'forceClose',
        value: true,
      });
      setWaiting(false);
    }
  };

  const numCandidates = election.candidates.filter(
    (c) => c.active && c.name != ''
  ).length;
  const numGrades = election.grades.filter(
    (g) => g.active && g.name != ''
  ).length;
  
  const disabled =
    !election.name ||
    election.name == '' ||
    numCandidates < 2 ||
    numGrades < 2 ||
    numGrades > gradeColors.length;

  return (
    <>
      <div className="d-none d-md-flex">
        <HeaderRubbonDesktop
          handleSubmit={handleSubmit}
          handleClosing={handleClosing}
          handleOpening={handleOpening}
          waiting={waiting}
          token={token}
        />
      </div>
      <div className="d-flex d-md-none">
        <HeaderRubbonMobile />
      </div>
      <Container
        fluid="xl"
        className="my-5 flex-column d-flex justify-content-center"
      >
        <Row>
          <Col className={isClosed(election) ? 'col-12' : 'col-lg-3 col-12'}>
            <Container className="py-4 d-none d-md-block">
              <h4>{t('common.the-vote')}</h4>
              {election.restricted && election.numVoters !== undefined && (
                <h5>
                  {t('admin.num-voters')} {election.numVoters}
                </h5>
              )}
              {election.numVoted !== undefined && (
                <h5>
                  {t('admin.num-voted')} {election.numVoted}
                </h5>
              )}
            </Container>
            <TitleField defaultName={election.name} />
            <CandidatesConfirmField />
          </Col>
          {!isClosed(election) && (
            <Col className="col-lg-9 col-12 mt-3 mt-md-0">
              <Container className="py-4 d-none d-md-block">
                <h4>{t('common.the-params')}</h4>
              </Container>
              <AccessResults />
              <ResultForAdminOnlyParam/>
              <LimitDate />
              <Grades />
              <Order />
              {election.restricted && <Private />}
            </Col>
          )}
        </Row>
        <Container className="my-5 d-md-flex d-grid justify-content-md-center">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            disabled={disabled}
            onClick={handleSubmit}
            icon={waiting ? undefined : faArrowRight}
            position="right"
          >
            {waiting ? <Spinner /> : t('admin.confirm-edit')}
          </Button>
          <div className="d-grid gap-3 mt-3 d-md-none">
            <ManageButtonsMobile
              handleClosing={handleClosing}
              waiting={waiting}
            />
          </div>
        </Container>
      </Container>
    </>
  );
};

const ManageElectionProviding = ({ err, context, token }) => {
  const { t } = useTranslation();
  if (err) {
    return <ErrorMessage>{t('admin.error')}</ErrorMessage>;
  }
  return (
    <ElectionProvider initialValue={context}>
      <Blur />
      <ManageElection token={token} />
    </ElectionProvider>
  );
};

export default ManageElectionProviding;

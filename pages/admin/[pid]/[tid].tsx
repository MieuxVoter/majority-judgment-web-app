import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {Container, Row, Col} from 'reactstrap';
import {
  faArrowRight,
  faSquarePollVertical,
} from '@fortawesome/free-solid-svg-icons';
import {getElection, updateElection} from '@services/api';
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
import {CandidateItem, GradeItem} from '@services/type';
import {gradeColors} from '@services/grades';
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
import {getUrl, RouteTypes} from '@services/routes';
import {sendInviteMails} from '@services/mail';
import {AppTypes, useAppContext} from '@services/context';

export async function getServerSideProps({query, locale}) {
  const {pid, tid: token} = query;
  const electionRef = pid.replaceAll('-', '');

  const [payload, translations] = await Promise.all([
    getElection(electionRef),
    serverSideTranslations(locale, ['resource']),
  ]);

  if ('message' in payload) {
    return {props: {err: payload.message, ...translations}};
  }

  const grades = payload.grades.map((g) => ({...g, active: true}));

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
    randomOrder,
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

const HeaderRubbon = ({token}) => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);

  const handleClosing = async () => {
    setWaiting(true);
    dispatch({
      type: ElectionTypes.SET,
      field: 'forceClose',
      value: true,
    });

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
      .map((g: GradeItem, i: number) => ({name: g.name, value: i, id: g.id}));

    const response = await updateElection(
      election.ref,
      election.name,
      candidates,
      grades,
      election.description,
      election.emails.length,
      election.hideResults,
      true,
      election.restricted,
      election.randomOrder,
      token
    );
    if (response.status === 200 && 'ref' in response) {
      if (election.restricted && election.emails.length > 0) {
        if (election.emails.length !== response.invites.length) {
          throw new Error('Unexpected number of invites!');
        }
        const urlVotes = response.invites.map((token: string) =>
          getUrl(RouteTypes.VOTE, router, response.ref, token)
        );
        const urlResult = getUrl(RouteTypes.RESULTS, router, response.ref);
        await sendInviteMails(
          election.emails,
          election.name,
          urlVotes,
          urlResult,
          router
        );
      }
      setWaiting(false);
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'success',
        message: t('success.election-closed'),
      });
    }
  };

  return (
    <div className="w-100 p-4 bg-primary text-white d-flex justify-content-between align-items-center">
      <h5 className="mx-0">{t('admin.admin-title')}</h5>

      <div className="d-flex">
        {!election.restricted && !isClosed(election) && (
          <Link href={getUrl(RouteTypes.VOTE, router, election.ref)}>
            <Button
              icon={faArrowRight}
              color="primary"
              className="me-3"
              style={{border: '2px solid rgba(255, 255, 255, 0.4)'}}
              position="right"
            >
              {t('admin.go-to-vote')}
            </Button>
          </Link>
        )}

        {canViewResults(election) && (
          <Link href={getUrl(RouteTypes.RESULTS, router, election.ref)}>
            <Button
              icon={faSquarePollVertical}
              color="primary"
              className="me-3"
              style={{border: '2px solid rgba(255, 255, 255, 0.4)'}}
              position="right"
            >
              {t('admin.go-to-result')}
            </Button>
          </Link>
        )}

        {!isClosed(election) && (
          <Button
            className="me-3 btn_closing"
            style={{border: '2px solid rgba(255, 255, 255, 0.4)'}}
            onClick={handleClosing}
            position="right"
          >
            {waiting ? <Spinner /> : t('admin.close-election')}
          </Button>
        )}
      </div>
    </div>
  );
};

const CreateElection = ({context, token}) => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (context) {
      dispatch({type: ElectionTypes.RESET, value: context});
    }
  }, [election.name, election.forceClose]);

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
      .map((g: GradeItem, i: number) => ({name: g.name, value: i, id: g.id}));
    setWaiting(true);

    const response = await updateElection(
      election.ref,
      election.name,
      candidates,
      grades,
      election.description,
      election.emails.length,
      election.hideResults,
      true,
      election.restricted,
      election.randomOrder,
      token
    );
    if (response.status === 200 && 'ref' in response) {
      if (election.restricted && election.emails.length > 0) {
        if (election.emails.length !== response.invites.length) {
          throw new Error('Unexpected number of invites!');
        }
        const urlVotes = response.invites.map((token: string) =>
          getUrl(RouteTypes.VOTE, router, response.ref, token)
        );
        const urlResult = getUrl(
          RouteTypes.RESULTS,
          router,
          response.ref,
          token
        );
        await sendInviteMails(
          election.emails,
          election.name,
          urlVotes,
          urlResult,
          router
        );
      }
      setWaiting(false);

      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'success',
        message: t('success.election-updated'),
      });
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
      <HeaderRubbon token={token} />
      <Container
        fluid="xl"
        className="my-5 flex-column d-flex justify-content-center"
      >
        <Container className="px-0 d-md-none mb-5">
          <h4>{t('admin.confirm-title')}</h4>
        </Container>
        <Row>
          <Col className={isClosed(election) ? 'col-12' : 'col-lg-3 col-12'}>
            <Container className="py-4 d-none d-md-block">
              <h4>{t('common.the-vote')}</h4>
            </Container>
            <TitleField defaultName={context.name} />
            <CandidatesConfirmField />
          </Col>
          {!isClosed(election) && (
            <Col className="col-lg-9 col-12 mt-3 mt-md-0">
              <Container className="py-4 d-none d-md-block">
                <h4>{t('common.the-params')}</h4>
              </Container>
              <AccessResults />
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
        </Container>
      </Container>
    </>
  );
};

const CreateElectionProviding = ({err, context, token}) => {
  const {t} = useTranslation();
  if (err) {
    return <ErrorMessage>{t('admin.error')}</ErrorMessage>;
  }
  return (
    <ElectionProvider>
      <Blur />
      <CreateElection context={context} token={token} />
    </ElectionProvider>
  );
};

export default CreateElectionProviding;

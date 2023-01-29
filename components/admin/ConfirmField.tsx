import {useTranslation} from 'next-i18next';
import {NextRouter, useRouter} from 'next/router';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {Button, Row, Col, Container} from 'reactstrap';
import TitleField from './Title';
import CandidatesConfirmField from './CandidatesConfirmField';
import AccessResults from './AccessResults';
import LimitDate from './LimitDate';
import Grades from './Grades';
import Private from './Private';
import Order from './Order';
import {
  useElection,
  ElectionContextInterface,
  hasEnoughCandidates,
  hasEnoughGrades,
  checkName,
  canBeFinished,
} from '@services/ElectionContext';
import {createElection, ElectionCreatedPayload} from '@services/api';
import {getUrl, RouteTypes} from '@services/routes';
import {GradeItem, CandidateItem} from '@services/type';
import {sendInviteMails} from '@services/mail';
import {AppTypes, useAppContext} from '@services/context';
import {useEffect} from 'react';

const submitElection = (
  election: ElectionContextInterface,
  successCallback: Function,
  failureCallback: Function,
  router: NextRouter
) => {
  const candidates = election.candidates
    .filter((c) => c.active)
    .map((c: CandidateItem) => ({
      name: c.name,
      description: c.description,
      image: c.image,
    }));
  const grades = election.grades
    .filter((c) => c.active)
    .map((g: GradeItem, i: number) => ({
      name: g.name,
      value: election.grades.length - 1 - i,
    }));

  createElection(
    election.name,
    candidates,
    grades,
    election.description,
    election.emails.length,
    election.hideResults,
    election.forceClose,
    election.restricted,
    election.randomOrder,
    election.dateEnd,
    async (payload: ElectionCreatedPayload) => {
      if (
        typeof election.emails !== 'undefined' &&
        election.emails.length > 0
      ) {
        if (
          typeof payload.invites === 'undefined' ||
          payload.invites.length !== election.emails.length
        ) {
          throw new Error('Can not send invite emails');
        }
        const urlVotes = payload.invites.map((token: string) =>
          getUrl(RouteTypes.VOTE, router, payload.ref, token)
        );
        const urlResult = getUrl(RouteTypes.RESULTS, router, payload.ref);
        await sendInviteMails(
          election.emails,
          election.name,
          urlVotes,
          urlResult,
          router
        );
      }
      successCallback(payload);
    },
    failureCallback
  );
};

const ConfirmField = ({onSubmit, onSuccess, onFailure}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [election, _] = useElection();
  const [app, dispatchApp] = useAppContext();

  useEffect(() => {
    // move to the head of the page on component loading
    window && window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
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

    onSubmit();

    submitElection(election, onSuccess, onFailure, router);
  };

  const disabled =
    !checkName(election) ||
    !hasEnoughCandidates(election) ||
    !hasEnoughGrades(election) ||
    !canBeFinished(election);

  return (
    <Container
      fluid="xl"
      className="my-5 flex-column d-flex justify-content-center"
    >
      <Container className="px-0 d-md-none mb-5">
        <h4>{t('admin.confirm-title')}</h4>
      </Container>
      <Row>
        <Col className="col-lg-3 col-12">
          <Container className="py-4 d-none d-md-block">
            <h4>{t('common.the-vote')}</h4>
          </Container>
          <TitleField />
          <CandidatesConfirmField />
        </Col>
        <Col className="col-lg-9 col-12 mt-3 mt-md-0">
          <Container className="py-4 d-none d-md-block">
            <h4>{t('common.the-params')}</h4>
          </Container>
          <AccessResults />
          <LimitDate />
          <Grades />
          <Order />
          <Private />
        </Col>
      </Row>
      <Container
        onClick={handleSubmit}
        className="my-5 d-md-flex d-grid justify-content-md-center"
      >
        <Button
          outline={true}
          color="secondary"
          className="bg-blue"
          disabled={disabled}
          icon={faArrowRight}
          position="right"
        >
          {t('admin.confirm-submit')}
        </Button>
      </Container>
    </Container>
  );
};

export default ConfirmField;

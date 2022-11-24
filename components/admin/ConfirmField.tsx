import {useState} from 'react'
import {useTranslation} from 'next-i18next';
import {
  faPen,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Row,
  Col,
  Container,
} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ErrorMessage from '@components/Error'
import CandidateField from './CandidateField';
import AccessResults from './AccessResults';
import LimitDate from './LimitDate';
import Grades from './Grades';
import Private from './Private';
import {useElection, ElectionContextInterface} from '@services/ElectionContext';
import {createElection, ElectionPayload} from '@services/api';
import {getUrlVote, getUrlResults} from '@services/routes';
import {GradeItem, CandidateItem} from '@services/type';
import {sendInviteMails} from '@services/mail';


const TitleField = () => {
  const {t} = useTranslation();
  const election = useElection();
  return (
    <Container className="bg-white p-4">
      <Row>
        <Col className="col-auto me-auto">
          <h5 className="text-dark">{t('admin.confirm-question')}</h5>
        </Col>
      </Row>
      <h4 className="text-primary">{election.name}</h4>
    </Container>
  );
};

const CandidatesField = () => {
  const {t} = useTranslation();
  const election = useElection();

  return (
    <Container className="bg-white p-4 mt-3 mt-md-0">
      <Row>
        <Col className="col-auto me-auto">
          <h5 className="text-dark">{t('admin.confirm-candidates')}</h5>
        </Col>
        <Col className="col-auto d-flex align-items-center">
          <FontAwesomeIcon icon={faPen} />
        </Col>
      </Row>
      {election.candidates.map((_, i) => (
        <CandidateField
          position={i}
          key={i}
          className="text-primary m-0 py-2"
        />
      ))}
    </Container>
  );
};


const submitElection = (
  election: ElectionContextInterface,
  successCallback: Function,
  failureCallback: Function,
) => {
  const candidates = election.candidates.filter(c => c.active).map((c: CandidateItem) => ({name: c.name, description: c.description, image: c.image}))
  const grades = election.grades.filter(c => c.active).map((g: GradeItem, i: number) => ({name: g.name, value: i}))

  createElection(
    election.name,
    candidates,
    grades,
    election.description,
    election.emails.length,
    election.hideResults,
    election.forceClose,
    election.restricted,
    async (payload: ElectionPayload) => {
      const id = payload.id;
      const tokens = payload.tokens;
      if (typeof election.emails !== 'undefined' && election.emails.length > 0) {
        if (typeof payload.tokens === 'undefined' || payload.tokens.length === election.emails.length) {
          throw Error('Can not send invite emails');
        }
        const urlVotes = payload.tokens.map((token: string) => getUrlVote(id.toString(), token));
        const urlResult = getUrlResults(id.toString());
        await sendInviteMails(
          election.emails,
          election.name,
          urlVotes,
          urlResult,
        );
      }
      successCallback(payload);
    },
    failureCallback,
  )
}


const ConfirmField = ({onSubmit, onSuccess, onFailure, goToCandidates, goToParams}) => {
  const {t} = useTranslation();
  const election = useElection();

  const handleSubmit = () => {

    onSubmit();

    submitElection(election, onSuccess, onFailure);
  }

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
          <CandidatesField />
        </Col>
        <Col className="col-lg-9 col-12 mt-3 mt-md-0">
          <Container className="py-4 d-none d-md-block">
            <h4>{t('common.the-params')}</h4>
          </Container>
          <AccessResults />
          <LimitDate />
          <Grades />
          <Private />
        </Col>
      </Row>
      <Container className="my-5 d-md-flex d-grid justify-content-md-center">
        <Button
          outline={true}
          color="secondary"
          className="bg-blue"
          onClick={handleSubmit}
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

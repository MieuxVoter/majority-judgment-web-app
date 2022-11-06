import { useTranslation } from 'next-i18next';
import Footer from '@components/layouts/Footer';
import TrashButton from './TrashButton';
import {
  faExclamationTriangle,
  faCheck,
  faArrowLeft,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Label,
  Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useElection } from './ElectionContext';
import CandidateField from './CandidateField';

const TitleField = () => {
  const { t } = useTranslation();
  const election = useElection();
  return (
    <Container className="bg-white container-fluid p-4">
      <Row>
        <Col className="col-auto me-auto">
          <h4 className="text-dark">{t('admin.access-results')}</h4>
        </Col>
      </Row>
      <h4 className="text-primary">{election.title}</h4>
    </Container>
  );
};

const CandidatesField = () => {
  const { t } = useTranslation();
  const election = useElection();
  return (
    <Container className="bg-white container-fluid p-4">
      <Row>
        <Col className="col-auto me-auto">
          <h4 className="text-dark">{t('admin.access-results')}</h4>
        </Col>
        <Col className="col-auto d-flex align-items-center">
          <FontAwesomeIcon icon={faPen} />
        </Col>
      </Row>
      {election.candidates.map((_, i) => (
        <CandidateField position={i} />
      ))}
    </Container>
  );
};

const ConfirmField = ({ onSubmit, goToCandidates, goToParams }) => {
  const { t } = useTranslation();
  const election = useElection();

  return (
    <Container className="params flex-grow-1 my-5 mt-5 flex-column d-flex justify-content-between">
      <Row>
        <Col className="col-md-auto col-12">
          <h4 className="mb-3">{t('common.the-vote')}</h4>
          <TitleField />
          <CandidatesField />
        </Col>
        <Col className="col-md-auto col-12"></Col>
      </Row>
    </Container>
  );
};

export default ConfirmField;

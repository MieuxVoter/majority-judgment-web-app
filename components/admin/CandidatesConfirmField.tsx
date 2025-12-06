import {useTranslation} from 'next-i18next';
import {Container, Row, Col} from 'reactstrap';
import {useElection} from '@services/ElectionContext';
import CandidateField from './CandidateField';

const CandidatesConfirmField = () => {
  const {t} = useTranslation();
  const [election] = useElection();

  return (
    <Container className="bg-white p-4 mt-3 mt-md-0">
      <Row>
        <Col className="col-auto me-auto">
          <h5 className="text-dark">{t('admin.confirm-candidates')}</h5>
        </Col>
      </Row>
      {election.candidates.map((_, i) => (
        <CandidateField
          position={i}
          key={i}
          className="text-primary m-0"
        />
      ))}
      { /*  Ajout d'un nouveau candidat <Button
        icon={faPlus}
        onClick={addCandidate}
        className="bg-primary text-white w-100 text-center"
      >
        {t('admin.add-candidate')}
      </Button>
      */ }
    </Container>
  );
};

export default CandidatesConfirmField;

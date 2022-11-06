import { useState, useEffect, createRef } from 'react';
import { useTranslation } from 'next-i18next';
import { Container } from 'reactstrap';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MAX_NUM_CANDIDATES } from '@services/constants';
import Alert from '@components/Alert';
import Button from '@components/Button';
import { useElection, useElectionDispatch } from './ElectionContext';
import CandidateField from './CandidateField';

const CandidatesField = ({ onSubmit }) => {
  const { t } = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidates = election.candidates;
  const [error, setError] = useState(null);
  const disabled = candidates.filter((c) => c.name !== '').length < 2;

  // What to do when we change the candidates
  useEffect(() => {
    // Initialize the list with at least two candidates
    if (candidates.length < 2) {
      dispatch({ type: 'candidate-push', value: 'default' });
    }
    if (candidates.length > MAX_NUM_CANDIDATES) {
      setError('error.too-many-candidates');
    }
  }, [candidates]);

  return (
    <Container className="candidate flex-grow-1 mt-5 flex-column d-flex justify-content-between">
      <div className="d-flex flex-column">
        <h4 className="mb-4">{t('admin.add-candidates')}</h4>
        <Alert msg={error} />
        {candidates.map((candidate, index) => {
          return <CandidateField key={index} position={index} />;
        })}
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button
          outline={true}
          color="secondary"
          onClick={onSubmit}
          disabled={disabled}
          icon={faArrowRight}
          position="right"
        >
          {t('admin.candidates-submit')}
        </Button>
      </div>
    </Container>
  );
};

export default CandidatesField;

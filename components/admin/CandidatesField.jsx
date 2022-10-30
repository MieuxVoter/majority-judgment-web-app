import {useState, useEffect, createRef} from 'react'
import {useTranslation} from "react-i18next";
import CandidateField from './CandidateField'
import Alert from '@components/Alert'
import {MAX_NUM_CANDIDATES} from '@services/constants';
import {Container} from 'reactstrap';
import {useElection, useElectionDispatch} from './ElectionContext';


const CandidatesField = () => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidates = election.candidates;
  const [error, setError] = useState(null)

  // What to do when we change the candidates
  useEffect(() => {
    // Initialize the list with at least two candidates
    if (candidates.length < 2) {
      dispatch({'type': 'candidate-push', 'value': "default"})
    }
    if (candidates.length > MAX_NUM_CANDIDATES) {
      setError('error.too-many-candidates')
    }
  }, [candidates])

  return (
    <Container className="candidate mt-5">
      <h4 className='mb-4'>{t('admin.add-candidates')}</h4>
      <Alert msg={error} />
      {candidates.map((candidate, index) => {
        return (
          <CandidateField
            key={index}
            position={index}
          />
        )
      })}
    </Container>
  );
}


export default CandidatesField


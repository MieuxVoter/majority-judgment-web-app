import {useState, useEffect} from 'react'
import {useTranslation} from "next-i18next";
import {Container, Row, Col} from 'reactstrap';
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {MAX_NUM_CANDIDATES} from '@services/constants';
import Button from '@components/Button'
import {useElection, useElectionDispatch} from './ElectionContext';
import Grades from './Grades'
import LimitDate from './LimitDate'
import AccessResults from './AccessResults'
import Private from './Private'


const ParamsField = ({onSubmit}) => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidates = election.candidates;
  const [error, setError] = useState(null)
  const disabled = candidates.filter(c => c.name !== "").length < 2;

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
    <Container className="params flex-grow-1 my-5 mt-5 flex-column d-flex justify-content-between">
      <div className="d-flex flex-column">

        <AccessResults />
        <LimitDate />
        <Grades />
        <Private />
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button outline={true} color="secondary" onClick={onSubmit} disabled={disabled} icon={faArrowRight} position="right">
          {t('admin.params-submit')}
        </Button>
      </div>
    </Container >
  );
}


export default ParamsField


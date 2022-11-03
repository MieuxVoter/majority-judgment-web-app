import {useState, useEffect} from 'react'
import {useTranslation} from "next-i18next";
import {Container, Row, Col} from 'reactstrap';
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {MAX_NUM_CANDIDATES} from '@services/constants';
import Button from '@components/Button'
import DatePicker from '@components/DatePicker'
import {useElection, useElectionDispatch} from './ElectionContext';


const Switch = ({toggle, state}) => {
  return (<div onClick={toggle} className="form-check form-switch">
    <input className="form-check-input" type="checkbox" role="switch" checked={state} />
  </div>)
}

const AccessResults = () => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();

  const toggle = () => {
    dispatch({
      'type': 'set',
      'field': 'restrictResult',
      'value': !election.restrictResult
    })
  }

  return (<Container className='bg-white container-fluid p-4'>
    <Row>
      <Col className='col-auto me-auto'>
        <h4 className='text-dark'>{t('admin.access-results')}</h4>
        <p className='text-muted'>{t('admin.access-results-desc')}</p>
      </Col>
      <Col className='col-auto d-flex align-items-center'>
        <Switch toggle={toggle} state={election.restrictResult} />
      </Col>
    </Row>
  </Container>)
}

const LimitDate = () => {
  const {t} = useTranslation();
  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(endDate.getUTCDate() + 15)
  const [endDate, setStartDate] = useState(defaultEndDate);

  const election = useElection();
  const dispatch = useElectionDispatch();

  const hasDate = () => {
    return election.endVote !== null;
  }

  const toggle = () => {
    dispatch({
      'type': 'set',
      'field': 'endVote',
      'value': hasDate() ? null : endVote,
    })
  }

  const desc = t('admin.limit-duration-desc');
  return (<Container className='bg-white container-fluid p-4 mt-1'>
    <Row>
      <Col className='col-auto me-auto'>
        <h4 className='text-dark'>{t('admin.limit-duration')}</h4>
        {desc === "" ? null :
          <p className='text-muted'>{desc}</p>
        }
      </Col>
      <Col className='col-auto d-flex align-items-center'>
        <Switch toggle={toggle} state={endVote} />
        <DatePicker />
      </Col>
    </Row>
  </Container>)
}

const Grades = () => {

}

const Private = () => {

}

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


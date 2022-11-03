/**
 * This component manages the date for ending the election
 */
import {useState} from 'react';
import {Row} from 'reactstrap';
import {useTranslation} from "next-i18next";
import {useElection, useElectionDispatch} from './ElectionContext';
import Toggle from '@components/Toggle';


const DateField = () => {
  const election = useElection();
  const dispatch = useElectionDispatch();
  const [toggle, setToggle] = useState(false)
  const {t} = useTranslation();


  return (<Row>
    <Col className='col-auto me-auto'>
      {t('admin.date-limit')}
    </Col>
    <Col className='col-auto'>
      <Toggle onChange={setToggle(t => !t)} />
    </Col>
  </Row>)
}

export default DateField;



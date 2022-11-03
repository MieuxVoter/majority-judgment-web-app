import {useState} from 'react'
import {useTranslation} from "next-i18next";
import {Container, Row, Col} from 'reactstrap';
import DatePicker from '@components/DatePicker'
import Switch from '@components/Switch'
import {useElection, useElectionDispatch} from './ElectionContext';


const LimitDate = () => {
  const {t} = useTranslation();
  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15)
  const [endDate, setEndDate] = useState(defaultEndDate);

  const election = useElection();
  const dispatch = useElectionDispatch();

  const hasDate = election.endVote !== null;

  const toggle = () => {
    dispatch({
      'type': 'set',
      'field': 'endVote',
      'value': hasDate ? null : endDate,
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
        <Switch toggle={toggle} state={hasDate} />
      </Col>
    </Row>
    {hasDate ?
      <>
        <DatePicker icon={null} date={endDate} setDate={setEndDate} />
        <span className="badge text-bg-light text-black-50">{t("Starting date")}</span>
      </>
      : null}
  </Container>)
}


export default LimitDate;

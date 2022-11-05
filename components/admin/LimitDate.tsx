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
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / oneDay);


  return (<Container className='bg-white container-fluid p-4 mt-1'>
    <Row>
      <Col className='col-auto me-auto'>
        <h4 className='text-dark'>
          {t('admin.limit-duration')}
          {hasDate ? <> {' '} <div className="badge ml-3 text-bg-light text-black-50">
            {`${t("admin.ending-in")} ${remainingDays} ${t("common.days")}`}
          </div> </> : null}
        </h4>
        {desc === "" ? null :
          <p className='text-muted'>{desc}</p>
        }
      </Col>
      <Col className='col-auto d-flex align-items-center'>
        <Switch toggle={toggle} state={hasDate} />
      </Col>
    </Row>
    {
      hasDate ?
        <Row>
          <Col className='col-auto'>
            <DatePicker date={endDate} setDate={setEndDate} />
          </Col>
          <Col className='col-auto'>
          </Col>
        </Row>
        : null
    }
  </Container >)
}


export default LimitDate;

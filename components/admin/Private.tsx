/**
 * A field to update the grades
 */
import {useState} from 'react'
import {useTranslation} from "next-i18next";
import {Container, Row, Col} from 'reactstrap';
import {useElection, useElectionDispatch} from './ElectionContext';

const Private = () => {
  const {t} = useTranslation();
  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15)
  const [endDate, setEndDate] = useState(defaultEndDate);

  const election = useElection();
  const dispatch = useElectionDispatch();

  return (<Container className='bg-white container-fluid p-4 mt-1'>
    <Row>
      <Col className='col-auto me-auto'>
        <h4 className='text-dark'>{t('common.grades')}</h4>
        <p className='text-muted'>{t('admin.grades-desc')}</p>
      </Col>
      <Col className='col-auto d-flex align-items-center'>
      </Col>
    </Row>
  </Container>)
}

export default Private;

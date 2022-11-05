/**
 * A field to update the grades
 */
import {useState} from 'react'
import {useTranslation} from "next-i18next";
import {Container, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import Switch from '@components/Switch'
import ListInput from '@components/ListInput'
import {useElection, useElectionDispatch} from './ElectionContext';

const validateEmail = (email) => {
  // https://stackoverflow.com/a/46181/4986615
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Private = () => {
  const {t} = useTranslation();

  const [emails, setEmails] = useState([]);

  const election = useElection();
  const dispatch = useElectionDispatch();

  const toggle = () => {
    dispatch({
      'type': 'set',
      'field': 'restrictVote',
      'value': !election.restrictVote,
    })
  }

  const handleEmails = (emails) => {
    dispatch({
      'type': 'set',
      'field': 'emails',
      'value': emails,
    })
  }

  return (<Container className='bg-white container-fluid p-4 mt-1'>
    <Row>
      <Col className='col-auto me-auto'>
        <h4 className='text-dark'>{t('admin.private-title')}</h4>
        <p className='text-muted'>{t('admin.private-desc')}</p>
      </Col>
      <Col className='col-auto d-flex align-items-center'>
        <Switch toggle={toggle} state={election.restrictVote} />
      </Col>
    </Row>
    {election.restrictVote ? <>
      <ListInput onEdit={handleEmails} inputs={election.emails} validator={validateEmail} />
      <Row className='text-bg-light bt-3 p-2 text-muted fw-bold'>
        <Col className='col-auto'>
          <FontAwesomeIcon icon={faCircleInfo} />
        </Col>
        <Col className='col-auto d-flex align-items-center'>
          {t("admin.private-tip")}
        </Col>
      </Row></> : null}
  </Container>)
}

export default Private;

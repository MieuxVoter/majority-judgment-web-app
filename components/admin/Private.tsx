/**
 * A field to update the grades
 */
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Switch from '@components/Switch';
import ListInput from '@components/ListInput';
import { useElection, useElectionDispatch } from './ElectionContext';

const validateEmail = (email) => {
  // https://stackoverflow.com/a/46181/4986615
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Private = () => {
  const { t } = useTranslation();

  const [emails, setEmails] = useState([]);

  const election = useElection();
  const dispatch = useElectionDispatch();

  const toggle = () => {
    dispatch({
      type: 'set',
      field: 'restrictVote',
      value: !election.restrictVote,
    });
  };

  const handleEmails = (emails) => {
    dispatch({
      type: 'set',
      field: 'emails',
      value: emails,
    });
  };

  return (
    <>
      <Container className="bg-white  p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto">
            <h4 className="mb-0 text-dark">{t('admin.private-title')}</h4>
            <p className="text-muted d-none d-md-block">
              {t('admin.private-desc')}
            </p>
          </div>
          <Switch toggle={toggle} state={election.restrictVote} />
        </div>
        {election.restrictVote ? (
          <>
            <ListInput
              onEdit={handleEmails}
              inputs={election.emails}
              validator={validateEmail}
            />
            <div className="bg-light bt-3 p-2 text-muted fw-bold d-none d-md-flex align-items-center ">
              <FontAwesomeIcon icon={faCircleInfo} />
              <div className="ms-3">{t('admin.private-tip')}</div>
            </div>
          </>
        ) : null}
      </Container>
      {election.restrictVote ? (
        <Container className="text-white d-md-none p-3">
          {t('admin.access-results-desc')}
        </Container>
      ) : null}
    </>
  );
};

export default Private;

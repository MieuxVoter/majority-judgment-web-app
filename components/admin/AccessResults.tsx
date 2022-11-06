import { useTranslation } from 'next-i18next';
import { useElection, useElectionDispatch } from './ElectionContext';
import { Container, Row, Col } from 'reactstrap';
import Switch from '@components/Switch';

const AccessResults = () => {
  const { t } = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();

  const toggle = () => {
    dispatch({
      type: 'set',
      field: 'restrictResult',
      value: !election.restrictResult,
    });
  };

  return (
    <Container className="bg-white container-fluid p-4">
      <Row>
        <Col className="col-auto me-auto">
          <h4 className="text-dark">{t('admin.access-results')}</h4>
          <p className="text-muted">{t('admin.access-results-desc')}</p>
        </Col>
        <Col className="col-auto d-flex align-items-center">
          <Switch toggle={toggle} state={election.restrictResult} />
        </Col>
      </Row>
    </Container>
  );
};

export default AccessResults;

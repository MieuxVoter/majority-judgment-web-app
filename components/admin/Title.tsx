/**
 * This component manages the title of the election
 */
import {useElection} from '@services/ElectionContext';
import {useTranslation} from 'next-i18next';
import {Col, Container, Row} from 'reactstrap';

const TitleField = () => {
  const {t} = useTranslation();
  const [election, _] = useElection();
  return (
    <Container className="bg-white p-4">
      <Row>
        <Col className="col-auto me-auto">
          <h5 className="text-dark">{t('admin.confirm-question')}</h5>
        </Col>
      </Row>
      <h4 className="text-primary">{election.name}</h4>
    </Container>
  );
};
export default TitleField;

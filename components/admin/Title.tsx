/**
 * This component manages the title of the election
 */
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useElection} from '@services/ElectionContext';
import {useTranslation} from 'next-i18next';
import {useState} from 'react';
import {Col, Container, Row} from 'reactstrap';
import TitleModal from './TitleModal';

const TitleField = () => {
  const {t} = useTranslation();
  const [election, _] = useElection();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  return (
    <Container onClick={toggle} className="bg-white p-4">
      <div className="w-100 text-dark d-flex justify-content-between">
        <h5 className="me-2">{t('admin.confirm-question')}</h5>
        <FontAwesomeIcon icon={faPen} />
      </div>
      <h4 className="text-primary">{election.name}</h4>
      <TitleModal isOpen={modal} toggle={toggle} />
    </Container>
  );
};
export default TitleField;

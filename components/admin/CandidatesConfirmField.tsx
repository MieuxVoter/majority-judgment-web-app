import {useTranslation} from "next-i18next";
import {Container, Row, Col} from "reactstrap";
import {useElection} from '@services/ElectionContext'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import CandidateField from "./CandidateField";


const CandidatesConfirmField = ({editable = true}) => {
  const {t} = useTranslation();
  const [election, _] = useElection();

  return (
    <Container className="bg-white p-4 mt-3 mt-md-0">
      <Row>
        <Col className="col-auto me-auto">
          <h5 className="text-dark">{t('admin.confirm-candidates')}</h5>
        </Col>
        <Col className="col-auto d-flex align-items-center">
          <FontAwesomeIcon icon={faPen} />
        </Col>
      </Row>
      {election.candidates.map((_, i) => (
        <CandidateField
          editable={editable}
          position={i}
          key={i}
          className="text-primary m-0"
        />
      ))}
    </Container>
  );
};


export default CandidatesConfirmField

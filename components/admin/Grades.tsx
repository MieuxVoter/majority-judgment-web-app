/**
 * A field to update the grades
 */
import {useState, useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import {Container, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {DEFAULT_GRADES, GRADE_COLORS} from '@services/constants';
import {useElection, useElectionDispatch} from '../../services/ElectionContext';
import GradeField from './GradeField';

const AddField = () => {
  const {t} = useTranslation();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  const dispatch = useElectionDispatch();

  return (
    <Row
      onClick={toggle}
      className="border border-2  border-primary text-black p-2 m-1 rounded-pill"
    >
      <Col className="col-auto">
        <FontAwesomeIcon icon={faPlus} />
      </Col>
    </Row>
  );
};

const Grades = () => {
  const {t} = useTranslation();
  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    dispatch({
      type: 'set',
      field: 'grades',
      value: DEFAULT_GRADES.map((g, i) => ({
        name: t(g),
        active: true,
        color: GRADE_COLORS[i],
      })),
    });
    console.log('foo');
  }, []);

  const election = useElection();
  const grades = election.grades;
  const dispatch = useElectionDispatch();

  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <h4 className="text-dark mb-0">{t('common.grades')}</h4>
      <p className="text-muted">{t('admin.grades-desc')}</p>
      <Row className="gx-1">
        {grades.map((_, i) => (
          <Col className="col-auto">
            <GradeField value={i} key={i} />
          </Col>
        ))}
        {/* <AddField /> */}
      </Row>
    </Container>
  );
};

export default Grades;

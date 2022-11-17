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
import {DndContext} from '@dnd-kit/core';
import {arrayMove, SortableContext} from '@dnd-kit/sortable';
import {DEFAULT_GRADES, GRADE_COLORS} from '@services/constants';
import {useElection, useElectionDispatch} from '@services/ElectionContext';
import GradeField from './GradeField';
import GradeModalAdd from './GradeModalAdd';
import {gradeColors} from '@services/grades';


const AddField = () => {
  const {t} = useTranslation();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  const election = useElection();
  const numGrades = election.grades.filter(g => g.active).length;
  const disabled = numGrades >= gradeColors.length;

  return (
    <Row
      role={disabled ? null : "button"}
      onClick={disabled ? null : toggle}
      className={`${disabled ? "bg-light text-black-50" : "bg-primary text-white"} p-2 m-1 rounded-1`}
    >
      <Col className="col-auto">
        <FontAwesomeIcon icon={faPlus} />
      </Col>
      <GradeModalAdd isOpen={modal} toggle={toggle} />
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
        value: i,
        active: true,
      })),
    });
  }, []);

  const election = useElection();
  const grades = election.grades;
  const dispatch = useElectionDispatch();

  const handleDragEnd = (event) => {
    /** 
     * Update the list of grades after dragging an item 
     */
    const {active, over} = event;

    if (active.id !== over.id) {
      const names = grades.map(g => g.name);
      const activeIdx = names.indexOf(active.id)
      const overIdx = names.indexOf(over.id)
      const newGrades = arrayMove(grades, activeIdx, overIdx);
      newGrades.forEach((g, i) => g.value = i);
      dispatch({
        type: "set",
        field: "grades",
        value: newGrades,
      });
    }
  }

  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <h4 className="text-dark mb-0">{t('common.grades')}</h4>
      <p className="text-muted">{t('admin.grades-desc')}</p>
      <Row className="gx-1">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={election.grades.map(g => g.name)}>
            {grades.map((grade, i) => (
              <Col key={i} className="col col-auto">
                <GradeField value={grade.value} />
              </Col>
            ))}
            <Col className="col col-auto">
              <AddField />
            </Col>
          </SortableContext>
        </DndContext>
      </Row>
    </Container>
  );
};

export default Grades;

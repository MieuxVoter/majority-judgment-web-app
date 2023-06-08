/**
 * A field to update the grades
 */
import {useState, useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import {Container, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {DndContext} from '@dnd-kit/core';
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {DEFAULT_GRADES} from '@services/constants';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import GradeField from './GradeField';
import GradeModalAdd from './GradeModalAdd';
import {gradeColors} from '@services/grades';
import Switch from '@components/Switch';

const AddField = () => {
  const {t} = useTranslation();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  const [election, _] = useElection();
  const numGrades = election.grades.filter((g) => g.active).length;
  const disabled = numGrades >= gradeColors.length;

  return (
    <Row
      role={disabled ? null : 'button'}
      onClick={disabled ? null : toggle}
      className={`${disabled ? 'bg-light text-black-50' : 'bg-primary text-white'
        } p-2 m-1 rounded-1`}
    >
      <Col className="col-auto">
        <FontAwesomeIcon icon={faPlus} />
      </Col>
      <GradeModalAdd
        key={election.grades.length}
        isOpen={modal}
        toggle={toggle}
      />
    </Row>
  );
};

const Grades = () => {
  const {t} = useTranslation();


  const [election, dispatch] = useElection();
  const grades = election.grades;
  const numGrades = grades.filter((g) => g.active).length;
  const disabled = numGrades >= gradeColors.length;

  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((m) => !m);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  useEffect(() => {
    if (election.grades.length < 2) {
      const defaultGrades = DEFAULT_GRADES.map((g, i) => ({
        name: t(g),
        value: DEFAULT_GRADES.length - 1 - i,
        active: true,
      }));
      dispatch({
        type: ElectionTypes.SET,
        field: 'grades',
        value: defaultGrades,
      });
    }
  }, []);

  const handleDragEnd = ({active, over}) => {
    console.log(active, over)
    if (active.id !== over.id) {
      const values = grades.map((g) => g.value);
      const oldIndex = values.indexOf(active.id);
      const newIndex = values.indexOf(over.id);
      dispatch({
        type: ElectionTypes.SET,
        field: 'grades',
        value: arrayMove(grades, oldIndex, newIndex),
      });
    }
  }


  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <div className="d-flex justify-content-between">
        <h5 className="mb-0 text-dark d-flex align-items-center">
          {t('admin.grades-title')}
        </h5>
        <Switch toggle={toggle} state={visible} />
      </div>
      {visible && (
        <>
          <p className="text-muted">{t('admin.grades-desc')}</p>
          <Row className="gx-1 text-black">

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={grades.map(g => g.value)}
                strategy={rectSwappingStrategy}
              >
                {grades.map((grade) => (
                  <Col key={grade.value} className="col col-auto">
                    <GradeField value={grade.value} />
                  </Col>))
                }
                <Col className="col col-auto">
                  <AddField />
                </Col>

              </SortableContext>
            </DndContext>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Grades;

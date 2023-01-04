/**
 * A field to update the grades
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { DEFAULT_GRADES } from '@services/constants';
import { ElectionTypes, useElection } from '@services/ElectionContext';
import GradeField from './GradeField';
import GradeModalAdd from './GradeModalAdd';
import { gradeColors } from '@services/grades';
import Switch from '@components/Switch';

const AddField = () => {
  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  const [election, _] = useElection();
  const numGrades = election.grades.filter((g) => g.active).length;
  const disabled = numGrades >= gradeColors.length;

  return (
    <Row
      role={disabled ? null : 'button'}
      onClick={disabled ? null : toggle}
      className={`${
        disabled ? 'bg-light text-black-50' : 'bg-primary text-white'
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
  const { t } = useTranslation();

  const [election, dispatch] = useElection();

  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);

  useEffect(() => {
    const defaultGrades = DEFAULT_GRADES.map((g, i) => ({
      name: t(g),
      value: DEFAULT_GRADES.length - 1 - i,
      active: true,
    }));
    if (election.grades.length < 2) {
      dispatch({
        type: ElectionTypes.SET,
        field: 'grades',
        value: defaultGrades,
      });
    }

    /*if (election.grades !== defaultGrades) {
      setVisible(true);
    }*/
  }, []);

  const handleDragEnd = (event) => {
    /**
     * Update the list of grades after dragging an item
     */
    const { active, over } = event;

    if (active.id !== over.id) {
      const names = election.grades.map((g) => g.name);
      const activeIdx = names.indexOf(active.id);
      const overIdx = names.indexOf(over.id);
      const newGrades = arrayMove(election.grades, activeIdx, overIdx);
      newGrades.forEach((g, i) => (g.value = i));
      dispatch({
        type: ElectionTypes.SET,
        field: 'grades',
        value: newGrades,
      });
    }
  };

  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <div className="d-flex justify-content-between">
        <h4 className="text-dark mb-0">{t('admin.grades-title')}</h4>
        <Switch toggle={toggle} state={visible} />
      </div>
      {visible && (
        <>
          <p className="text-muted">{t('admin.grades-desc')}</p>
          <Row className="gx-1">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={election.grades.map((g) => g.name)}>
                {election.grades.map((grade, i) => (
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
        </>
      )}
    </Container>
  );
};

export default Grades;

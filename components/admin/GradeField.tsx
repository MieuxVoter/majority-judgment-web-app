import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faRotateLeft} from '@fortawesome/free-solid-svg-icons';
import {useSortable} from '@dnd-kit/sortable';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import {getGradeColor, gradeColors} from '@services/grades';
import VerticalGripDots from '@components/VerticalGripDots';
import GradeModalSet from './GradeModalSet';

export interface GradeInterface {
  value: number;
}

const GradeField = ({value}: GradeInterface) => {
  const [election, dispatch] = useElection();

  const grade = election.grades.find((g) => g.value === value);
  const activeGrade = election.grades.filter((g) => g.active);
  const numGrades = activeGrade.length;

  const id = `${grade.value}`
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({ id });

  const [visible, setVisible] = useState<boolean>(false);
  const toggle = () => setVisible((v) => !v);

  const handleActive = () => {
    if (!grade.active && numGrades >= gradeColors.length) {
      return;
    }
    dispatch({
      type: ElectionTypes.GRADE_SET,
      position: grade.value,
      field: 'active',
      value: !grade.active,
    });
  };

  const gradeIndex = activeGrade.findIndex((g) => g.value === grade.value);
  const color = getGradeColor(numGrades - gradeIndex - 1, numGrades);

  const style = {
    color: grade.active ? 'white' : '#8F88BA',
    backgroundColor: grade.active ? color : '#F2F0FF',
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : null,
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="py-2 pe-3 m-1 fw-bold rounded-1 d-flex justify-content-between gap-1"
    >
      <div
        role="button"
        tabIndex="0"
        aria-roledescription='draggable grade'
        aria-describedby={`draggable grade ${value}`}
        style={{touchAction: 'none'}}
        {...attributes}
        {...listeners}
        className="d-flex align-items-center"
      >
        <VerticalGripDots />
      </div>
      <div
        style={{touchAction: 'none'}}
        className={grade.active ? '' : 'text-decoration-line-through'}
        role="button"
        onClick={toggle}
      >
        {grade.name}
      </div>
      <div className="d-flex gap-2 align-items-center ms-2">
        {grade.active ? (
          <>
            <FontAwesomeIcon
              onClick={handleActive}
              icon={grade.active ? faXmark : faRotateLeft}
              style={{color: 'black', opacity: '25%'}}
            />
          </>
        ) : (
          <FontAwesomeIcon onClick={handleActive} icon={faRotateLeft} />
        )}
      </div>
      <GradeModalSet toggle={toggle} isOpen={visible} value={value} />
    </div>
  );
};

export default GradeField;

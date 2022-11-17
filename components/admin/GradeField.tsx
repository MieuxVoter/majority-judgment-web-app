import {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faXmark,
  faCheck,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import {useElection, useElectionDispatch} from '@services/ElectionContext';
import {gradeColors} from '@services/grades';
import {useSortable} from '@dnd-kit/sortable';


export interface GradeInterface {
  value: number;
}

export default ({value}: GradeInterface) => {
  const election = useElection();
  const grade = election.grades.filter(g => g.value === value)[0];
  const dispatch = useElectionDispatch();

  const activeGrade = election.grades.filter(g => g.active)
  const numGrades = activeGrade.length;
  const gradeIdx = activeGrade.map(g => g.value).indexOf(value);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: grade.name});

  const handleActive = () => {
    if (!grade.active && numGrades >= gradeColors.length) {
      return
    }
    dispatch({
      type: 'grade-set',
      position: value,
      field: 'active',
      value: !grade.active,
    });
  };

  const color = getGradeColor(gradeIdx, numGrades);

  const style = {
    color: grade.active ? 'white' : '#8F88BA',
    backgroundColor: grade.active ? color : '#F2F0FF',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : null,
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="py-2 px-3 m-1 fw-bold rounded-1 d-flex justify-content-between gap-3"
    >
      <div
        {...attributes}
        {...listeners}
        style={{touchAction: "none"}}
        className={grade.active ? '' : 'text-decoration-line-through'}>
        {grade.name}
      </div>
      <div>
        <FontAwesomeIcon
          onClick={handleActive}
          icon={grade.active ? faXmark : faRotateLeft}
        />
      </div>
    </div>
  );
};


const getGradeColor = (gradeIdx: number, numGrades: number): string => {
  const extraColors = gradeColors.length - numGrades;
  if (extraColors < 0) {
    throw Error("More grades than available colors");
  }
  const startIndex = Math.floor(extraColors / 2);
  const colors = gradeColors.slice(startIndex, gradeColors.length - (extraColors - startIndex));
  if (colors.length < numGrades) {
    throw Error("Issue with the number of colors");
  }
  return colors[colors.length - gradeIdx - 1]
}

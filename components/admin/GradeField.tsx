import { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faXmark,
  faCheck,
  faRotateLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { ElectionTypes, useElection } from '@services/ElectionContext';
import { getGradeColor, gradeColors } from '@services/grades';
import { useSortable } from '@dnd-kit/sortable';
import VerticalGripDots from '@components/VerticalGripDots';

export interface GradeInterface {
  value: number;
}

export default ({ value }: GradeInterface) => {
  const [election, dispatch] = useElection();

  const grade = election.grades.filter((g) => g.value === value)[0];
  const activeGrade = election.grades.filter((g) => g.active);
  const numGrades = activeGrade.length;
  const gradeIdx = activeGrade.map((g) => g.value).indexOf(value);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: grade.name });

  const handleActive = () => {
    if (!grade.active && numGrades >= gradeColors.length) {
      return;
    }
    dispatch({
      type: ElectionTypes.GRADE_SET,
      position: value,
      field: 'active',
      value: !grade.active,
    });
  };

  const color = getGradeColor(gradeIdx, numGrades);

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
      <div {...attributes} {...listeners} className="d-flex align-items-center">
        <VerticalGripDots height={15} width={30} />
      </div>
      <div
        style={{ touchAction: 'none' }}
        className={grade.active ? '' : 'text-decoration-line-through'}
      >
        {grade.name}
      </div>
      <div className="d-flex gap-2 align-items-center ms-2">
        {grade.active ? (
          <>
            <FontAwesomeIcon
              onClick={handleActive}
              icon={grade.active ? faXmark : faRotateLeft}
              style={{ color: 'black', opacity: '25%' }}
            />
          </>
        ) : (
          <FontAwesomeIcon onClick={handleActive} icon={faRotateLeft} />
        )}
      </div>
    </div>
  );
};

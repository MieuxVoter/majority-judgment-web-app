import {useState, useCallback, useEffect, MouseEvent} from 'react';
import {useBallot, BallotTypes} from '@services/BallotContext';
import {getGradeColor} from '@services/grades';

interface GradeInputInterface {
  gradeId: number;
  candidateId: number;
}
const GradeInput = ({gradeId, candidateId}: GradeInputInterface) => {
  const [ballot, dispatch] = useBallot();
  if (!ballot) {throw Error("Ensure the election is loaded")}

  const grade = ballot.election.grades[gradeId];
  const numGrades = ballot.election.grades.length;

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    dispatch({type: BallotTypes.VOTE, candidateId: candidateId, gradeId: gradeId})
  };

  const active = ballot.votes.some(b => b.gradeId === gradeId && b.candidateId === candidateId)
  const color = active ? getGradeColor(gradeId, numGrades) : '#C3BFD8';

  return (
    <div
      className={`text-lg-center  my-1 rounded-1 px-2 py-1 fs-5 text-white ms-3`}
      onClick={handleClick}
      style={{backgroundColor: color, boxShadow: active ? `0px 2px 0px ${color}` : "0px 2px 0px #8F88BA"}}
    >
      {grade.name}
    </div >
  )
}

export default GradeInput

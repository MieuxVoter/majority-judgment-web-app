import {useState, useCallback, useEffect, MouseEvent} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {useBallot, BallotTypes} from '@services/BallotContext';
import {getGradeColor} from '@services/grades';


const GradeName = ({name, active}) => {
  return (<>
    {active ?
      <div className="me-3">
        <FontAwesomeIcon icon={faCheck} />
      </div> : null}
    <div className="">
      {name}
    </div>
  </>)
}
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

  return (<>
    <div
      className={`justify-content-center d-none d-lg-flex my-1 rounded-1 px-2 py-1 fs-5 text-white ms-3`}
      onClick={handleClick}
      style={{backgroundColor: color, boxShadow: active ? `0px 2px 0px ${color}` : "0px 2px 0px #8F88BA"}}
    >
      <GradeName name={grade.name} active={active} />
    </div >
    <div
      className={`d-flex d-lg-none my-1 justify-content-center py-2 text-white`}
      onClick={handleClick}
      style={{
        backgroundColor: color,
        boxShadow: active ? `0px 2px 0px ${color}` : "0px 2px 0px #8F88BA",
        width: "200px"
      }}
    >
      <GradeName name={grade.name} active={active} />
    </div >
  </>
  )
}

export default GradeInput

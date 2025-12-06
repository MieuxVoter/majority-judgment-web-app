import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {useBallot, BallotTypes} from '@services/BallotContext';
import { getRankedGradeColor } from '@services/grades';


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
  if (!ballot) {throw new Error("Ensure the election is loaded")}

  const grade = ballot.election.grades[gradeId];

  const handleClick = () => {
    dispatch({type: BallotTypes.VOTE, candidateId: candidateId, gradeId: gradeId})
  };

  const active = ballot.votes.some(b => b.gradeId === gradeId && b.candidateId === candidateId)

  let displayBackgroundColor: string = '#C3BFD8'; // Inactive background
  let displayBoxShadowColor: string = '#8F88BA';  // Inactive shadow

  if (active) {
    const activeColor = getRankedGradeColor(gradeId, ballot.election.grades);
    if (activeColor) {
      displayBackgroundColor = activeColor;
      displayBoxShadowColor = activeColor;
    } else {
      console.warn(
        `GradeInput: Failed to determine active color. Using fallback styling. ` +
        `GradeId: ${gradeId}, Grade name: '${grade.name}'.`
      );
    }
  }

  return (<>
    <div
      className={`justify-content-center d-none d-md-flex my-1 rounded-1 px-2 py-1 fs-5 text-white ms-3`}
      onClick={handleClick}
      style={{
        backgroundColor: displayBackgroundColor,
        boxShadow: `0px 2px 0px ${displayBoxShadowColor}`
      }}
    >
      <GradeName name={grade.name} active={active} />
    </div >
    <div
      className={`d-flex d-md-none my-1 justify-content-center py-2 text-white`}
      onClick={handleClick}
      style={{
        backgroundColor: displayBackgroundColor,
        boxShadow: `0px 2px 0px ${displayBoxShadowColor}`,
        width: "200px"
      }}
    >
      <GradeName name={grade.name} active={active} />
    </div >
  </>
  )
}

export default GradeInput

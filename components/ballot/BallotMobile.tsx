import {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useBallot} from '@services/BallotContext';
import CandidateCard from '@components/ballot/CandidateCard'
import GradeInput from '@components/ballot/GradeInput'
import {CandidatePayload} from '@services/api';
import CandidateModal from '@components/CandidateModalGet';


interface TitleInterface {
  name: string;
}

const TitleName = ({name}: TitleInterface) => {
  return (
    <div className="fw-bold text-white w-75 p-4">
      {name}
    </div>
  )
}

const BallotMobile = () => {
  const [ballot, _] = useBallot();
  const [offset, setOffset] = useState(0);

  const numGrades = ballot.election.grades.length;

  const [candidate, setCandidate] = useState<CandidatePayload | null>(null);

  const moveRight = (right: boolean) => {
    if (right) setOffset(o => o - 247);
    else setOffset(o => o + 247);
  }

  return (
    <div className="d-block d-md-none">
      <TitleName name={ballot.election.name} />
      <div className="w-100 d-flex">
        {ballot.election.candidates.map((candidate, candidateId) => {
          return (
            <div key={candidateId} className="bg-white flex-column  d-flex my-4 mx-2 py-4 px-3 candidate-vote" style={{"left": offset === 0 ? 0 : offset + 30}}>
              <div className="d-flex align-items-center mb-1">
                {candidateId !== 0 ?
                  <div className="me-2"
                    onClick={() => moveRight(false)}
                  >
                    <FontAwesomeIcon color="#0A004C" icon={faChevronLeft} />
                  </div> : null}
                <CandidateCard
                  onClick={() => setCandidate(candidate)}
                  candidate={candidate}
                />

                {candidateId !== ballot.election.candidates.length - 1 ?
                  <div className="ms-2" onClick={() => moveRight(true)}><FontAwesomeIcon color="#0A004C" icon={faChevronRight} /></div> : null}
              </div>
              <div className="d-flex mt-2 flex-column">
                {ballot.election.grades.sort((a, b) => b.value - a.value).map((_, gradeId) => {
                  console.assert(gradeId < numGrades);
                  return (
                    <GradeInput
                      key={gradeId}
                      gradeId={gradeId}
                      candidateId={candidateId}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        <CandidateModal isOpen={candidate !== null} toggle={() => setCandidate(null)} candidate={candidate} />
      </div>
    </div >
  )
}

export default BallotMobile

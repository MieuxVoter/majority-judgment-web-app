import {MouseEvent, useState} from 'react'
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import Button from '@components/Button';
import {Col, Row, Container} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendarDays, faCheck} from '@fortawesome/free-solid-svg-icons';
import {useBallot, BallotTypes, BallotProvider} from '@services/BallotContext';
import CandidateCard from '@components/ballot/CandidateCard'
import TitleBar from '@components/ballot/TitleBar'
import GradeInput from '@components/ballot/GradeInput'
import {CandidatePayload} from '@services/api';
import CandidateModal from '@components/CandidateModalGet';


const BallotDesktop = () => {
  const {t} = useTranslation();

  const [ballot, dispatch] = useBallot();
  const numGrades = ballot.election.grades.length;
  const disabled = ballot.votes.length !== ballot.election.candidates.length;

  const router = useRouter();

  const [candidate, setCandidate] = useState(null);

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault();

    // const gradesById = {};
    // judgments.forEach((c) => {
    //   gradesById[c.id] = c.value;
    // });
    // const gradesByCandidate = [];
    // Object.keys(gradesById).forEach((id) => {
    //   gradesByCandidate.push(gradesById[id]);
    // });

    // castBallot(gradesByCandidate, election.id.toString(), token, () => {
    router.push(`/confirm/${ballot.election.id}`);
    // });
  };

  console.log(candidate)
  return (
    <div className="w-100 h-100 d-none d-md-block">
      <TitleBar election={ballot.election} />
      <Container className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{maxWidth: "750px"}}>
        <h1 className="mb-5">{ballot.election.name}</h1>
        {ballot.election.candidates.map((candidate, candidateId) => {
          return (
            <div key={candidateId} className="bg-white justify-content-between d-flex my-2 py-2 w-100 px-3">
              <CandidateCard
                onClick={() => setCandidate(candidate)}
                candidate={candidate}
              />
              <div className="d-flex">
                {ballot.election.grades.map((_, gradeId) => {
                  console.assert(gradeId < numGrades);
                  return (
                    <GradeInput key={gradeId} gradeId={gradeId} candidateId={candidateId} />
                  );
                })}
              </div>
            </div>
          );
        })}
        <CandidateModal isOpen={candidate !== null} toggle={() => setCandidate(null)} candidate={candidate} />
        <Container className="my-5 d-md-flex d-grid justify-content-md-center">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            onClick={handleSubmit}
            disabled={disabled}
            icon={faCheck}
            position="left"
          >
            {t('vote.submit')}
          </Button>
        </Container>
      </Container>
    </div>
  )
}
export default BallotDesktop

import {useState} from 'react';
import {Container} from 'reactstrap';
import {useBallot} from '@services/BallotContext';
import CandidateCard from '@components/ballot/CandidateCard';
import TitleBar from '@components/ballot/TitleBar';
import GradeInput from '@components/ballot/GradeInput';
import {CandidatePayload} from '@services/api';
import CandidateModal from '@components/CandidateModalGet';
import {useTranslation} from 'next-i18next';

const BallotDesktop = ({hasVoted}) => {
  const {t} = useTranslation();

  const [ballot, dispatch] = useBallot();
  const numGrades = ballot.election.grades.length;
  const disabled = ballot.votes.length !== ballot.election.candidates.length;

  const [candidate, setCandidate] = useState<CandidatePayload | null>(null);

  return (
    <div className="w-100 h-100 d-none d-md-block">
      <TitleBar election={ballot.election} />
      <Container
        className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
        style={{maxWidth: '1050px'}}
      >
        <h1 className="mb-5">{ballot.election.name}</h1>
        {hasVoted && <h5 className="d-flex text-start">
          {t("vote.already-voted")}
        </h5>}
        {ballot.election.candidates.map((candidate, candidateId) => {
          return (
            <div
              key={candidateId}
              className="bg-white justify-content-between d-flex my-2 py-2 w-100 px-3"
            >
              <CandidateCard
                onClick={() => setCandidate(candidate)}
                candidate={candidate}
              />
              <div className="d-flex">
                {ballot.election.grades.sort(
                  (a, b) => b.value - a.value
                ).map((_, gradeId) => {
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
        <CandidateModal
          isOpen={candidate !== null}
          toggle={() => setCandidate(null)}
          candidate={candidate}
        />
      </Container>
    </div>
  );
};
export default BallotDesktop;

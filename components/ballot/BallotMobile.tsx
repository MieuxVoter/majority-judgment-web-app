import {MouseEvent, useState} from 'react'
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import Button from '@components/Button';
import {Col, Row, Container} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useBallot, BallotTypes, BallotProvider} from '@services/BallotContext';
import CandidateCard from '@components/ballot/CandidateCard'
import GradeInput from '@components/ballot/GradeInput'


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
  const {t} = useTranslation();

  const [ballot, _] = useBallot();
  const [offset, setOffset] = useState(0);

  const numGrades = ballot.election.grades.length;
  const disabled = ballot.votes.length !== ballot.election.candidates.length;
  const router = useRouter();

  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault();
    router.push(`/confirm/${ballot.election.id}`);
  };

  const moveRight = (right: boolean) => {
    if (right) setOffset(o => o - 247);
    else setOffset(o => o + 247);
  }

  return (
    <div className="w-100 h-100 d-block d-lg-none">

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
                <CandidateCard candidate={candidate} />

                {candidateId !== ballot.election.candidates.length - 1 ?
                  <div className="ms-2" onClick={() => moveRight(true)}><FontAwesomeIcon color="#0A004C" icon={faChevronRight} /></div> : null}
              </div>
              <div className="d-flex mt-2 flex-column">
                {ballot.election.grades.map((_, gradeId) => {
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
      </div>
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
    </div >
  )
}

export default BallotMobile

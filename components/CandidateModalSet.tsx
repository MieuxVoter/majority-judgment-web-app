/**
 * A modal to details a candidate
 */
import {ElectionPayload} from '@services/api';
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

interface CandidateModal {
  isOpen: boolean;
  toggle: Function;
  election: ElectionPayload;
}

const CandidateModal = ({isOpen, toggle, election}) =>
(
  < Modal
    isOpen={isOpen}
    toggle={toggle}
    keyboard={true}
    className="modalVote voteDesktop"
  >
    <div className="my-auto">
      <ModalHeader className="modalVoteHeader">{election.name}</ModalHeader>
      <ModalBody className="modalVoteBody">
        <form onSubmit={handleSubmit} autoComplete="off">
          {election.candidates.map((candidate, candidateId) => {
            return (
              <Row key={candidateId} className="cardVote">
                <Col className="cardVoteLabel">
                  <h5 className="m-0">{candidate.name}</h5>
                  <h5 className="m-0">{candidate.description}</h5>
                </Col>
                <Col className="cardVoteGrades">
                  {election.grades.map((grade, gradeId) => {
                    console.assert(gradeId < numGrades);
                    const gradeValue = grade.value;
                    const color = getGradeColor(gradeId, numGrades);
                    return (
                      <Col
                        key={gradeId}
                        className="text-lg-center mx-2 voteCheck"
                      >
                        <label
                          htmlFor={
                            'candidateGrade' +
                            candidateId +
                            '-' +
                            gradeValue
                          }
                          className="check"
                        >
                          <small
                            className="nowrap d-lg-none bold badge"
                            style={
                              judgments.find((judgment) => {
                                return (
                                  JSON.stringify(judgment) ===
                                  JSON.stringify({
                                    id: candidate.id,
                                    value: gradeValue,
                                  })
                                );
                              })
                                ? {
                                  backgroundColor: color,
                                  color: '#fff',
                                }
                                : {
                                  backgroundColor: 'transparent',
                                  color: '#000',
                                }
                            }
                          >
                            {grade.name}
                          </small>
                          <input
                            type="radio"
                            name={'candidate' + candidateId}
                            id={
                              'candidateGrade' +
                              candidateId +
                              '-' +
                              gradeValue
                            }
                            data-index={candidateId}
                            data-id={candidate.id}
                            value={grade.value}
                            onClick={handleGradeClick}
                            defaultChecked={judgments.find((element) => {
                              return (
                                JSON.stringify(element) ===
                                JSON.stringify({
                                  id: candidate.id,
                                  value: gradeValue,
                                })
                              );
                            })}
                          />
                          <span
                            className="checkmark candidateGrade "
                            style={
                              judgments.find(function (judgment) {
                                return (
                                  JSON.stringify(judgment) ===
                                  JSON.stringify({
                                    id: candidate.id,
                                    value: gradeValue,
                                  })
                                );
                              })
                                ? {
                                  backgroundColor: color,
                                  color: '#fff',
                                }
                                : {
                                  backgroundColor: '#C3BFD8',
                                  color: '#000',
                                }
                            }
                          >
                            <small
                              className="nowrap bold badge"
                              style={{
                                backgroundColor: 'transparent',
                                color: '#fff',
                              }}
                            >
                              {grade.name}
                            </small>
                          </span>
                        </label>
                      </Col>
                    );
                  })}
                </Col>
              </Row>
            );
          })}

          <Row>
            <Col className="text-center">
              {judgments.length !== election.candidates.length ? (
                <VoteButtonWithConfirm
                  action={handleSubmitWithoutAllRate}
                />
              ) : (
                <Button type="submit" className="mt-5 btn btn-transparent">
                  <FontAwesomeIcon icon={faCheck} />
                  {t('Submit my vote')}
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </ModalBody>
    </div>
    <Footer />
  </Modal >

import {useState, useCallback, useEffect, MouseEvent} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
// import {toast, ToastContainer} from "react-toastify";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendarDays, faCheck} from '@fortawesome/free-solid-svg-icons';
import {getElection, castBallot, apiErrors, ElectionPayload} from '@services/api';
import ErrorMessage from '@components/Error';
import useEmblaCarousel from 'embla-carousel-react';
import {DotButton} from '@components/admin/EmblaCarouselButtons';
import VoteButtonWithConfirm from '@components/admin/VoteButtonWithConfirm';
import {getGradeColor} from '@services/grades';

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export async function getServerSideProps({query: {pid, tid}, locale}) {
  const [election, translations] = await Promise.all([
    getElection(pid),
    serverSideTranslations(locale, ['resource']),
  ]);

  if (typeof election === 'string' || election instanceof String) {
    return {props: {err: election, ...translations}};
  }

  if (!election || !election.candidates || !Array.isArray(election.candidates)) {
    return {props: {err: 'Unknown error', ...translations}};
  }

  const description = JSON.parse(election.description);

  if (description.randomOrder) {
    shuffle(election.candidates);
  }

  return {
    props: {
      ...translations,
      election,
      pid: pid,
      token: tid || null,
    },
  };
}

interface VoteInterface {
  election?: ElectionPayload;
  err: string;
  token?: string;
}

const VoteBallot = ({election, err, token}: VoteInterface) => {
  const {t} = useTranslation();

  if (err || !election) {
    return <ErrorMessage msg={t(apiErrors(err))} />;
  }

  const numGrades = election.grades.length;
  const [judgments, setJudgments] = useState([]);
  const colSizeCandidateLg = 4;
  const colSizeCandidateMd = 6;
  const colSizeCandidateXs = 12;
  const colSizeGradeLg = Math.floor((12 - colSizeCandidateLg) / numGrades);
  const colSizeGradeMd = Math.floor((12 - colSizeCandidateMd) / numGrades);
  const colSizeGradeXs = Math.floor((12 - colSizeCandidateXs) / numGrades);

  const router = useRouter();

  const handleGradeClick = (event: MouseEvent<HTMLInputElement>) => {
    let data = {
      id: parseInt(event.currentTarget.getAttribute('data-id')),
      value: parseInt(event.currentTarget.value),
    };
    //remove candidate
    const newJudgments = judgments.filter(
      (judgment) => judgment.id !== data.id
    );
    newJudgments.push(data);
    setJudgments(newJudgments);
  };

  const handleSubmitWithoutAllRate = () => {
    alert(t('You have to judge every candidate/proposal!'));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const gradesById = {};
    judgments.forEach((c) => {
      gradesById[c.id] = c.value;
    });
    const gradesByCandidate = [];
    Object.keys(gradesById).forEach((id) => {
      gradesByCandidate.push(gradesById[id]);
    });

    castBallot(gradesByCandidate, election.id.toString(), token, () => {
      router.push(`/vote/${election.id}/confirm`);
    });
  };

  const [viewportRef, embla] = useEmblaCarousel({skipSnaps: false});
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  return (
    <Container className="homePage">
      <Head>
        <title>{election.name}</title>

        <meta key="og:title" property="og:title" content={election.name} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>

      <div className="w-100 bg-light text-center">
        <FontAwesomeIcon icon={faCalendarDays} />
        VOTE OUVERT
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <h1>{election.name}</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="embla" ref={viewportRef}>
            <div className="embla__container">
              {election.candidates.map((candidate, candidateId) => {
                return (
                  <div className="embla__slide">
                    <Row key={candidateId} className="cardVote">
                      <Col className="cardVoteLabel mb-3">
                        <h5 className="m-0">{candidate.name}</h5>
                        <h5 className="m-0">{candidate.id + 1}</h5>
                      </Col>
                      <Col className="cardVoteGrades">
                        {election.grades.map((grade, gradeId) => {
                          console.assert(gradeId < numGrades);
                          const gradeValue = grade.value;
                          const color = getGradeColor(gradeId, numGrades);
                          return (
                            <Col
                              key={gradeId}
                              className="text-lg-center my-1 voteCheck"
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
                                  defaultChecked={judgments.find(
                                    (element) => {
                                      return (
                                        JSON.stringify(element) ===
                                        JSON.stringify({
                                          id: candidate.id,
                                          value: gradeValue,
                                        })
                                      );
                                    }
                                  )}
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
                    <div className="d-flex embla__nav">
                      <div
                        className="embla__btn embla__prev"
                        onClick={scrollPrev}
                      >
                        {candidate.id + 1}
                      </div>
                      <div
                        className="embla__btn embla__next"
                        onClick={scrollNext}
                      >
                        Next
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="embla__dots">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  selected={index === selectedIndex}
                  onClick={() => scrollTo(index)}
                  value={index + 1}
                />
              ))}
            </div>
          </div>
        </form>
      </div>
      <Row className="btn-background mx-0">
        <Col className="text-center">
          {judgments.length !== election.candidates.length ? (
            <VoteButtonWithConfirm action={handleSubmitWithoutAllRate} />
          ) : (
            <Button type="submit" className="my-3 btn btn-transparent">
              <FontAwesomeIcon icon={faCheck} />
              {t('Submit my vote')}
            </Button>
          )}
        </Col>
      </Row>
    </Container >
  );
};
export default VoteBallot;

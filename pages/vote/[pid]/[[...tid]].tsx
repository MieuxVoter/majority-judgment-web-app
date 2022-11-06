import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import Link from 'next/link';
// import {toast, ToastContainer} from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { getDetails, castBallot, apiErrors } from '@services/api';
import Error from '@components/Error';
import { translateGrades } from '@services/grades';
import Footer from '@components/layouts/Footer';
import useEmblaCarousel from 'embla-carousel-react';
import {
  DotButton,
  PrevButton,
  NextButton,
} from '@components/admin/EmblaCarouselButtons';
import VoteButtonWithConfirm from '@components/admin/VoteButtonWithConfirm';

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export async function getServerSideProps({ query: { pid, tid }, locale }) {
  const [details, translations] = await Promise.all([
    getDetails(pid),
    serverSideTranslations(locale, ['resource']),
  ]);

  if (typeof details === 'string' || details instanceof String) {
    return { props: { err: details, ...translations } };
  }

  if (!details.candidates || !Array.isArray(details.candidates)) {
    return { props: { err: 'Unknown error', ...translations } };
  }

  shuffle(details.candidates);

  return {
    props: {
      ...translations,
      invitationOnly: details.on_invitation_only,
      restrictResults: details.restrict_results,
      candidates: details.candidates.map((name, i, infos) => ({
        id: i,
        label: name,
        description: infos,
      })),
      title: details.title,
      numGrades: details.num_grades,
      pid: pid,
      token: tid || null,
    },
  };
}

const VoteBallot = ({ candidates, title, numGrades, pid, err, token }) => {
  const { t } = useTranslation();

  if (err) {
    return <Error msg={apiErrors(err, t)}></Error>;
  }

  const [judgments, setJudgments] = useState([]);
  const colSizeCandidateLg = 4;
  const colSizeCandidateMd = 6;
  const colSizeCandidateXs = 12;
  const colSizeGradeLg = Math.floor((12 - colSizeCandidateLg) / numGrades);
  const colSizeGradeMd = Math.floor((12 - colSizeCandidateMd) / numGrades);
  const colSizeGradeXs = Math.floor((12 - colSizeCandidateXs) / numGrades);

  const router = useRouter();

  const allGrades = translateGrades(t);
  const grades = allGrades.filter(
    (grade) => grade.value >= allGrades.length - numGrades
  );

  const handleGradeClick = (event) => {
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

    castBallot(gradesByCandidate, pid, token, () => {
      router.push(`/vote/${pid}/confirm`);
    });
  };
  const toggle = () => setVisibility(!visibled);
  const [visibled, setVisibility] = useState(false);
  const toggleMobile = () => setVisibilityMobile(!visibledMobile);
  const [visibledMobile, setVisibilityMobile] = useState(false);
  const toggleDesktop = () => setVisibilityDesktop(!visibledDesktop);
  const [visibledDesktop, setVisibilityDesktop] = useState(false);

  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
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
        <title>{title}</title>

        <title>{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>
      {
        // <ToastContainer />
      }
      <Container className="homePage">
        <section>
          <div className="sectionOneHomeForm pb-5">
            <Row className="sectionOneHomeRowOne">
              <Col className="sectionOneHomeContent sectionOneVoteContent">
                <Row>
                  <img
                    src="/logos/logo.svg"
                    alt="logo of Mieux Voter"
                    height="128"
                    className="d-block mb-5"
                  />
                </Row>
                <Row>
                  <h2 className="mb-4 mt-5">{t('Bienvenue')}</h2>
                </Row>
                <Row>
                  <h4 className="mb-5">
                    {t(
                      'Participez au vote et découvrez le vote par jugement majoritaire.'
                    )}
                  </h4>
                </Row>

                <Row>
                  <Button
                    type="submit"
                    className="btn btn-block btn-secondary voteDesktop"
                    onClick={toggleDesktop}
                  >
                    {t('Je participe au vote')}
                    <img src="/arrow-white.svg" />
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-block btn-secondary voteMobile"
                    onClick={toggleMobile}
                  >
                    {t('Je participe au vote')}
                    <img src="/arrow-white.svg" />
                  </Button>
                </Row>
                <Row className="noAds my-0">
                  <p>{t('resource.noAds')}</p>
                </Row>
                <Row>
                  <Link href="/">
                    <Button className="btn-black mt-2 mb-5">
                      {t('En savoir plus sur Mieux voter')}
                    </Button>
                  </Link>
                </Row>
              </Col>
              <Col></Col>
            </Row>
            <Row></Row>
          </div>
        </section>
        <section className="sectionTwoHome">
          <Row className="sectionTwoRowOne">
            <Col className="sectionTwoRowOneCol">
              <img
                src="/urne.svg"
                alt="icone d'urne"
                height="128"
                className="d-block mx-auto"
              />
              <h4>Simple</h4>
              <p>Créez un vote en moins d’une minute</p>
            </Col>
            <Col className="sectionTwoRowOneCol">
              <img
                src="/email.svg"
                alt="icone d'enveloppe"
                height="128"
                className="d-block mx-auto"
              />
              <h4>Gratuit</h4>
              <p>Envoyez des invitations par courriel sans limite d'envoi</p>
            </Col>
            <Col className="sectionTwoRowOneCol">
              <img
                src="/respect.svg"
                alt="icone de mains qui se serrent"
                height="128"
                className="d-block mx-auto"
              />
              <h4>Respect de votre vie privée</h4>
              <p>Aucune donnée personnelle n'est enregistrée</p>
            </Col>
          </Row>
          <Row className="sectionTwoRowTwo">
            <Row className="sectionTwoHomeImage">
              <img src="/vote.svg" />
            </Row>
            <Row className="sectionTwoRowTwoCol">
              <h3 className="col-md-7">
                Une expérience de vote démocratique et intuitive
              </h3>
            </Row>
            <Row className="sectionTwoRowTwoCol">
              <Col className="sectionTwoRowTwoColText col-md-4">
                <h5 className="">Exprimez toute votre opinion</h5>
                <p>
                  Au jugement majoritaire, chaque candidat est évalué sur une
                  grille de mention. Vous n’aurez plus besoin de faire un vote
                  stratégique.
                </p>
              </Col>
              <Col className="sectionTwoRowTwoColText col-md-4 offset-md-1">
                <h5 className="">Obtenez le meilleur consensus</h5>
                <p>
                  Le profil des mérites dresse un panorama précis de l’opinion
                  des électeurs. Le gagnant du vote est celui qui est la
                  meilleure mention majoritaire.
                </p>
              </Col>
            </Row>
            <Row className="sectionTwoRowThreeCol">
              <Button className="btn btn-block btn-secondary btn-sectionTwoHome">
                Découvrez le jugement majoritaire
                <img src="/arrow-white.svg" />
              </Button>
            </Row>
          </Row>
          <Row className="sharing">
            <p>Partagez l’application Mieux voter</p>
            <Link href="https://www.facebook.com/mieuxvoter.fr/">
              <img src="/facebook.svg" />
            </Link>
            <Link href="https://twitter.com/mieux_voter">
              <img src="/twitter.svg" />
            </Link>
          </Row>
        </section>
        <Footer />
      </Container>
      <Modal
        isOpen={visibledDesktop}
        toggle={toggleDesktop}
        className="modalVote voteDesktop"
      >
        <div className="my-auto">
          <ModalHeader className="modalVoteHeader">{title}</ModalHeader>
          <ModalBody className="modalVoteBody">
            <form onSubmit={handleSubmit} autoComplete="off">
              {candidates.map((candidate, candidateId) => {
                return (
                  <Row key={candidateId} className="cardVote">
                    <Col className="cardVoteLabel">
                      <h5 className="m-0">{candidate.label}</h5>
                      <h5 className="m-0">{candidate.infos}</h5>
                    </Col>
                    <Col className="cardVoteGrades">
                      {grades.map((grade, gradeId) => {
                        console.assert(gradeId < numGrades);
                        const gradeValue = grade.value;
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
                                        backgroundColor: grade.color,
                                        color: '#fff',
                                      }
                                    : {
                                        backgroundColor: 'transparent',
                                        color: '#000',
                                      }
                                }
                              >
                                {grade.label}
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
                                        backgroundColor: grade.color,
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
                                  {grade.label}
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
                  {judgments.length !== candidates.length ? (
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
      </Modal>

      <Modal
        isOpen={visibledMobile}
        toggle={toggleMobile}
        className="modalVote voteMobile"
      >
        <div className="my-auto">
          <ModalHeader className="modalVoteHeader">{title}</ModalHeader>
          <ModalBody className="modalVoteBody">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="embla" ref={viewportRef}>
                <div className="embla__container">
                  {candidates.map((candidate, candidateId) => {
                    return (
                      <div className="embla__slide">
                        <Row key={candidateId} className="cardVote">
                          <Col className="cardVoteLabel mb-3">
                            <h5 className="m-0">{candidate.label}</h5>
                            <h5 className="m-0">{candidate.id + 1}</h5>
                          </Col>
                          <Col className="cardVoteGrades">
                            {grades.map((grade, gradeId) => {
                              console.assert(gradeId < numGrades);
                              const gradeValue = grade.value;
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
                                              backgroundColor: grade.color,
                                              color: '#fff',
                                            }
                                          : {
                                              backgroundColor: 'transparent',
                                              color: '#000',
                                            }
                                      }
                                    >
                                      {grade.label}
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
                                              backgroundColor: grade.color,
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
                                        {grade.label}
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
          </ModalBody>
        </div>
        <Row className="btn-background mx-0">
          <Col className="text-center">
            {judgments.length !== candidates.length ? (
              <VoteButtonWithConfirm action={handleSubmitWithoutAllRate} />
            ) : (
              <Button type="submit" className="my-3 btn btn-transparent">
                <FontAwesomeIcon icon={faCheck} />
                {t('Submit my vote')}
              </Button>
            )}
          </Col>
        </Row>
        <Footer />
      </Modal>
    </Container>
  );
};
export default VoteBallot;

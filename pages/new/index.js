import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Collapse,
  Container,
  Row,
  Col,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Button,
  Card,
  CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter, CustomInput
} from "reactstrap";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faCheck,
  faCogs,
  faExclamationTriangle,
  faArrowLeft,
  faExclamationCircle,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "@services/context";
import { createElection } from "@services/api";
import { translateGrades } from "@services/grades";
import HelpButton from "@components/form/HelpButton";
import Loader from "@components/wait";
import CandidatesField from "@components/form/CandidatesField";
import ConfirmModal from "@components/form/ConfirmModal";
import config from "../../next-i18next.config.js";
import Footer from '@components/layouts/Footer'


// Error messages
const AT_LEAST_2_CANDIDATES_ERROR = "Please add at least 2 candidates.";
const NO_TITLE_ERROR = "Please add a title.";

const isValidDate = (date) => date instanceof Date && !isNaN(date);
const getOnlyValidDate = (date) => (isValidDate(date) ? date : new Date());

// Convert a Date object into YYYY-MM-DD
const dateToISO = (date) =>
  getOnlyValidDate(date).toISOString().substring(0, 10);


// Retrieve the current hour, minute, sec, ms, time into a timestamp
const hours = (date) => getOnlyValidDate(date).getHours() * 3600 * 1000;
const minutes = (date) => getOnlyValidDate(date).getMinutes() * 60 * 1000;
const seconds = (date) => getOnlyValidDate(date).getSeconds() * 1000;
const ms = (date) => getOnlyValidDate(date).getMilliseconds();
const time = (date) =>
  hours(getOnlyValidDate(date)) +
  minutes(getOnlyValidDate(date)) +
  seconds(getOnlyValidDate(date)) +
  ms(getOnlyValidDate(date));

// Retrieve the time part from a timestamp and remove the day. Return a int.
const timeMinusDate = (date) => time(getOnlyValidDate(date));

// Retrieve the day and remove the time. Return a Date
const dateMinusTime = (date) =>
  new Date(getOnlyValidDate(date).getTime() - time(getOnlyValidDate(date)));

const displayClockOptions = () =>
  Array(24)
    .fill(1)
    .map((x, i) => (
      <option value={i} key={i}>
        {i}h00
      </option>
    ));

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [], config)),
  },
});

const CreateElection = (props) => {
  const { t } = useTranslation();

  // default value : start at the last hour
  const now = new Date();
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState([{ label: "" }, { description: "" }]);
  const [numGrades, setNumGrades] = useState(6);
  const [waiting, setWaiting] = useState(false);
  const [isGradesOpen, setGradesOpen] = useState(false);
  const [isAddCandidateMOpen, setAddCandidateMOpen] = useState(false);
  const [isTimeLimited, setTimeLimited] = useState(false);
  const [restrictResult, setRestrictResult] = useState(false);
  const [restrictVote, setRestrictVote] = useState(false);
  const [start, setStart] = useState(
    new Date(now.getTime() - minutes(now) - seconds(now) - ms(now))
  );
  const [finish, setFinish] = useState(
    new Date(start.getTime() + 7 * 24 * 3600 * 1000)
  );
  const [emails, setEmails] = useState([]);

  // set the title on loading
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    const { title: urlTitle } = router.query;
    setTitle(urlTitle || "");
  }, [router.isReady]);

  const handleIsTimeLimited = (event) => {
    setTimeLimited(event.target.value === "1");
  };

  const handleRestrictResultCheck = (event) => {
    setRestrictResult(event.target.value === "1");
  };
  const handleRestrictVote = (event) => {
    setRestrictVote(event.target.value === "1");
  };

  const toggleMails = () => setVisibilityMails(!visibledMails)
  const toggleGrades = () => setVisibilityGrades(!visibledGrades)
  const toggle = () => setVisibility(!visibled)


  const toggleAddCandidateM = () => {
    setAddCandidateMOpen(!isAddCandidateMOpen);
  };

  const addCandidate = () => {
    if (candidates.length < 1000) {
      candidates.push({ label: "" });
      setCandidates(candidates);
    }
  };

  const checkFields = () => {
    if (!candidates) {
      return { ok: false, msg: AT_LEAST_2_CANDIDATES_ERROR };
    }

    let numCandidates = 0;
    candidates.forEach((c) => {
      if (c.label !== "") numCandidates += 1;
    });
    if (numCandidates < 2) {
      return { ok: false, msg: AT_LEAST_2_CANDIDATES_ERROR };
    }

    if (!title || title === "") {
      return { ok: false, msg: NO_TITLE_ERROR };
    }

    return { ok: true, msg: "OK" };
  };

  const handleSubmit = () => {
    const check = checkFields();
    if (!check.ok) {
      toast.error(t(check.msg), {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    setWaiting(true);

    createElection(
      title,
      candidates.map((c) => c.label).filter((c) => c !== ""),
      {
        mails: emails,
        numGrades,
        start: start.getTime() / 1000,
        finish: finish.getTime() / 1000,
        restrictResult: restrictResult,
        restrictVote: restrictVote,
        locale: router.locale.substring(0, 2).toLowerCase(),
      },
      (result) => {
        if (result.id) {
          router.push(`/new/confirm/${result.id}`);
        } else {
          toast.error(t("Unknown error. Try again please."), {
            position: toast.POSITION.TOP_CENTER,
          });
          setWaiting(false);
        }
      }
    );
  };

  const [visibled, setVisibility] = useState(false);
  const [visibledGrades, setVisibilityGrades] = useState(false);
  const [visibledMails, setVisibilityMails] = useState(false);
  const handleSendNotReady = (msg) => {
    toast.error(t(msg), {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const check = checkFields();
  const grades = translateGrades(t);

  const [showModal, setShowModal] = useState(false);
  // Mangae display
  const [selected, setSelectedState] = useState(false);
  const [displayNone, setDisplayNone] = useState("none");
  const [displayBlock, setDisplayBlock] = useState("none");
  useEffect(() => {
    setDisplayNone("mt-0 " + (selected ? "displayNone" : ""))
  }, [selected]);
  useEffect(() => {
    setDisplayBlock("settings " + (selected ? "displayBlock" : ""))
  }, [selected]);
  const changeDisplay = () => {
    setSelectedState(!selected);
  };
  const badgesValues = [5, 6, 7];
  const [badgesValue, setbadgesValue] = useState(6);
  const handleFirstSubmit = () => {
    const check = checkFields();
    if (!check.ok) {
      toast.error(t(check.msg), {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    changeDisplay();

  };
 
  return (
    <Container className="addCandidatePage">
      <Head>
        <meta
          key="og:title"
          property="og:title"
          content={t("common.application")}
        />
        <meta
          property="og:description"
          key="og:description"
          content={t("resource.valueProp")}
        />
      </Head>
      <ToastContainer />
      {waiting ? <Loader /> : ""}
      <form className="form" onSubmit={handleSubmit} autoComplete="off">
        <div className={displayNone}>
          <Row className="stepForm">
            <Col className="stepFormCol">
              <img src="/icone-one-white.svg" />
              <h4>Les candidats</h4>
            </Col>
            <Col className="stepFormCol opacity">
              <img src="/icone-two-dark.svg" />
              <h4>Paramètres du vote</h4>
            </Col>
            <Col className="stepFormCol opacity">
              <img src="/icone-three-dark.svg" />
              <h4>Confirmation</h4>

            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <CandidatesField onChange={setCandidates} />
            </Col>
          </Row>

          <Row className="justify-content-center">
            <div className="mx-auto mt-5">

              <Button onClick={handleFirstSubmit} className="cursorPointer btn-opacity btn-validation mb-5" >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
            </div>
          </Row>
        </div>




        <div className={displayBlock}>
          <div onClick={changeDisplay} className="btn-return-candidates"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Retour aux candidats</div>
          <Row className="stepForm">
            <Col className="stepFormCol">
              <img src="/icone-check-dark.svg" />
              <h4>Les candidats</h4>
            </Col>
            <Col className="stepFormCol">
              <img src="/icone-two-white.svg" />
              <h4>Paramètres du vote</h4>
            </Col>
            <Col className="stepFormCol opacity">
              <img src="/icone-three-dark.svg" />
              <h4>Confirmation</h4>

            </Col>
          </Row>
          <div className="settings-modal-body ">
            <div className="mobile-title">{t("Vos paramètres")}</div>
            <Row>
              <Col>
                <Row className="row-label">
                  <Col xs="10" lg="10">
                    <Label htmlFor="title">{t("Access to results")} {t("Immediately")}</Label>

                  </Col>
                  <Col l xs="2" lg="2">
                    <div className="radio-group">
                      <input
                        className="radio"
                        type="radio"
                        name="restrict_result"
                        id="restrict_result_false"
                        onClick={handleRestrictResultCheck}
                        defaultChecked={!restrictResult}
                        value="0"
                      />
                      <label htmlFor="restrict_result_false" />
                      <input
                        className="radio"
                        type="radio"
                        name="restrict_result"
                        id="restrict_result_true"
                        onClick={handleRestrictResultCheck}
                        defaultChecked={!restrictResult}
                        value="1"
                      />
                      <label htmlFor="restrict_result_true" />
                      <div className="radio-switch"></div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" md="10">
                    <p>{t("No one will be able to see the result until the end date is reached or until all participants have voted.")}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr className="settings-divider" />
            <div className="row-label" id="voting-time-label">
              <Row>

                <Col xs="10">
                  <Label htmlFor="title">{t("Voting time")}</Label>
                </Col>
                <Col l xs="2">
                  <div className="radio-group">
                    <input
                      className="radio"
                      type="radio"
                      name="time_limited"
                      id="is_time_limited_false"
                      onClick={handleIsTimeLimited}
                      defaultChecked={isTimeLimited}
                      value="0"
                    /><label htmlFor="is_time_limited_false" />
                    <input
                      className="radio"
                      type="radio"
                      name="time_limited"
                      id="is_time_limited_true"
                      onClick={handleIsTimeLimited}
                      defaultChecked={isTimeLimited}
                      value="1"
                    />
                    <label htmlFor="is_time_limited_true" />
                    <div className="radio-switch"></div>
                  </div>
                </Col>

              </Row>
              <div
                className={
                  (isTimeLimited ? "d-block " : "d-none")
                }
              >
                <Row className="displayNone">
                  <Col xs="12" md="3" lg="3">
                    <span className="label">- {t("Starting date")}</span>
                  </Col>
                  <Col xs="6" md="4" lg="3">
                    <input
                      className="form-control"
                      type="date"
                      value={dateToISO(start)}
                      onChange={(e) => {
                        setStart(
                          new Date(
                            timeMinusDate(start) +
                            new Date(e.target.valueAsNumber).getTime()
                          )
                        );
                      }}
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3">
                    <select
                      className="form-control"
                      value={getOnlyValidDate(start).getHours()}
                      onChange={(e) =>
                        setStart(
                          new Date(
                            dateMinusTime(start).getTime() +
                            e.target.value * 3600000
                          )
                        )
                      }
                    >
                      {displayClockOptions()}
                    </select>
                  </Col>
                </Row>

                <Row className="mt-2">

                  <Col xs="6" md="4" lg="3" className="time-container">
                    <input
                      className="form-control"
                      type="date"
                      value={dateToISO(finish)}
                      min={dateToISO(start)}
                      onChange={(e) => {
                        setFinish(
                          new Date(
                            timeMinusDate(finish) +
                            new Date(e.target.valueAsNumber).getTime()
                          )
                        );
                      }}
                    />
                  </Col>
                  <Col xs="6" md="5" lg="3" className="displayNone">
                    <select
                      className="form-control"
                      value={getOnlyValidDate(finish).getHours()}
                      onChange={(e) =>
                        setFinish(
                          new Date(
                            dateMinusTime(finish).getTime() +
                            e.target.value * 3600000
                          )
                        )
                      }
                    >
                      {displayClockOptions()}
                    </select>
                  </Col>
                </Row>
              </div></div>
            <hr className="settings-divider" />
            <Row className="componentMobile">
              <Col>
                <Row className="row-label">
                  <Label>{t("Grades")}</Label>
                  <FontAwesomeIcon onClick={toggleGrades} icon={faChevronRight} className="ml-2 my-auto" />

                </Row>
                <Row className="mx-0">
                  <p className="m-0">{t("You can select here the number of grades for your election")}</p>
                </Row>
              </Col>
            </Row>

            <Modal
              isOpen={visibledGrades}
              toggle={toggleGrades}
              className="modal-dialog-centered grades-mobile"
            ><ModalHeader toggle={toggleGrades}>
                <Label>{t("Grades")}</Label>
              </ModalHeader>
              <ModalBody>
                <p>{t("Choisissez le nombre de mentions des votes.")}</p>
                <div className="numGradesContainer justify-content-center" tabIndex={candidates.length + 3}>

                  {badgesValues.map(f => (

                    <Label className="numGrades numGradesMobile">
                      <Input type="radio" name="radio" value={f} checked={badgesValue === f}
                        onChange={e => setNumGrades(e.currentTarget.value)} />
                      <div className="customCheckmarck customCheckmarckMobile"><p>{f}</p></div>
                    </Label>
                  ))}
                </div>
                <p className="mt-2">{t("Voici la liste des mentions de votre vote")}</p>
                {grades.map((mention, i) => {
                  return (
                    <span
                      key={i}
                      className={"badge badge-light mx-1 my-2 " + mention.class}
                      style={{
                        backgroundColor: mention.color,
                        color: "#fff",
                        opacity: i < numGrades ? 1 : 0.3,
                      }}
                    >
                      {mention.label}
                    </span>
                  );
                })}
                <Row>
                  <Button
                    type="button"
                    className="btn-confirm-mobile"
                    onClick={toggleGrades}>
                    <FontAwesomeIcon className="mr-2" icon={faCheck} />
                    {t("Valider les mentions")}
                  </Button>
                </Row>

              </ModalBody>
            </Modal>


            <Row className="componentDesktop">
              <Col xs="9">
                <Label>{t("Grades")}</Label>
                <p>{t("You can select here the number of grades for your election")}</p>
              </Col>
              <Col xs="3">
                <div className="numGradesContainer justify-content-end" tabIndex={candidates.length + 3}>
                  {badgesValues.map(f => (

                    <Label className="numGrades ">
                      <Input type="radio" name="radio" value={f} checked={badgesValue === f}
                        onChange={e => setNumGrades(e.currentTarget.value)} />
                      <div className="customCheckmarck"><p>{f}</p></div>
                    </Label>
                  ))}

                </div>
              </Col>
              <Col
                xs="12"
                md="9"
                lg="9"
              >
                {grades.map((mention, i) => {
                  return (
                    <span
                      key={i}
                      className={"badge badge-light mr-2 mt-2 " + mention.class}
                      style={{
                        backgroundColor: mention.color,
                        color: "#fff",
                        opacity: i < numGrades ? 1 : 0.3,
                      }}
                    >
                      {mention.label}
                    </span>
                  );
                })}
              </Col>
            </Row>
            <hr className="settings-divider" />
            <Row>
              <Col>
                <Row className="row-label">
                  <Col xs="10" lg="10">
                    <Label htmlFor="title">{t("Vote privée")}</Label>

                  </Col>
                  <Col l xs="2" lg="2">
                    <div className="radio-group">
                      <input
                        className="radio"
                        type="radio"
                        name="restrict_result"
                        id="restrict_result_false"
                        onClick={handleRestrictResultCheck}
                        defaultChecked={!restrictResult}
                        value="0"
                      />
                      <label htmlFor="restrict_result_false" />
                      <input
                        className="radio"
                        type="radio"
                        name="restrict_result"
                        id="restrict_result_true"
                        onClick={handleRestrictResultCheck}
                        defaultChecked={!restrictResult}
                        value="1"
                      />
                      <label htmlFor="restrict_result_true" />
                      <div className="radio-switch"></div>
                    </div>
                  </Col>
                </Row>

                <Row className="mx-0"><p className="mx-0">{t("Uniquement les personnes invités par mail pourront participé au vote")}</p></Row>
              </Col></Row>
            <hr className="settings-divider" />
            <Row className="componentMobile">
              <Col xs="12">
                <Row className="row-label">
                  <Label>{t("Participants")}</Label>
                  <FontAwesomeIcon onClick={toggleMails} icon={faChevronRight} className="ml-2 my-auto" />
                </Row>
                <p>{t("Copier-coller les emails des participants depuis un fichier Excel")}</p>
                <Modal
                  isOpen={visibledMails}
                  toggle={toggleMails}
                  className="modal-dialog-centered grades-mobile"
                >
                  <ModalHeader toggle={toggleMails}>
                    <Label>{t("Ajouter des invités")}</Label>
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <p className="mr-2 my-auto">{t("À ")}</p>

                      <ReactMultiEmail
                        placeholder={t("Add here participants' emails")}
                        emails={emails}
                        onChange={setEmails}
                        validateEmail={(email) => {
                          return isEmail(email); // return boolean
                        }}
                        getLabel={(email, index, removeEmail) => {
                          return (
                            <div data-tag key={index}>
                              {email}
                              <span
                                data-tag-handle
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </span>

                            </div>

                          );
                        }}

                      />
                    </Row>
                    <Row>
                      <Button
                        type="button"
                        className="btn-confirm-mobile"
                        onClick={toggleMails}>
                        <FontAwesomeIcon className="mr-2" icon={faCheck} />
                        {t("Valider les mails")}
                      </Button>
                    </Row>
                  </ModalBody>
                </Modal>



              </Col>
            </Row>
            <Row className="componentDesktop">
              <Col xs="12">
                <Label>{t("Participants")}</Label>
                <p>{t("If you list voters' emails, only them will be able to access the election")}</p>
                <ReactMultiEmail
                  placeholder={t("Add here participants' emails")}
                  emails={emails}
                  onChange={setEmails}
                  validateEmail={(email) => {
                    return isEmail(email); // return boolean
                  }}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
                />
                <div className="mt-2 mailMutedText">
                  <small className="text-muted">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    {t("Copier-coller les emails des participants depuis un fichier Excel")}
                  </small>
                </div>
              </Col>
            </Row>
            <hr className="settings-divider" />
            <Col xs="12" md="3">

            </Col>
          </div>
          <div className="justify-content-center">
            {check.ok ? (
              <ConfirmModal
                title={title}
                candidates={candidates}
                isTimeLimited={isTimeLimited}
                start={start}
                finish={finish}
                emails={emails}
                restrictResult={restrictResult}
                restrictVote={restrictVote}
                grades={grades.slice(0, numGrades)}
                className={"btn float-right btn-block"}
                tabIndex={candidates.length + 1}
                confirmCallback={handleSubmit}
              />
            ) : (
              <div>
                <Button onClick={handleSendNotReady} className="mt-5 componentDesktop btn-transparent cursorPointer btn-validation mb-5 mx-auto" >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
                <Button

                  className="componentMobile btn-confirm-mobile mb-5"
                  onClick={handleSendNotReady}>
                  <FontAwesomeIcon className="mr-2" icon={faCheck} />
                  {t("Valider")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
      <Footer />
    </Container>
  );
};

export default CreateElection;

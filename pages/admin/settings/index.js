import {useState, useEffect} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
// import {
//   Collapse,
//   Container,
//   Row,
//   Col,
//   Input,
//   Label,
//   InputGroup,
//   InputGroupAddon,
//   Button,
//   Card,
//   CardBody,
//   Modal, ModalHeader, ModalBody, ModalFooter, CustomInput
// } from "reactstrap";
// import {ReactMultiEmail, isEmail} from "react-multi-email";
// import "react-multi-email/style.css";
// import {toast, ToastContainer} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import queryString from "query-string";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {
//   faPlus,
//   faTrashAlt,
//   faCheck,
//   faCogs,
//   faExclamationTriangle,
//   faArrowLeft,
//   faExclamationCircle
// } from "@fortawesome/free-solid-svg-icons";
// import {useAppContext} from "@services/context";
// import {createElection} from "@services/api";
// import {translateGrades} from "@services/grades";
// import HelpButton from "@components/admin/HelpButton";
// import Loader from "@components/wait";
// import CandidatesField from "@components/admin/CandidatesField";
// import ConfirmModal from "@components/admin/ConfirmModal";
// import config from "../../next-i18next.config.js";


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

export const getStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, [])),
  },
});

const CreateElection = (props) => {
  const {t} = useTranslation();

  // default value : start at the last hour
  const now = new Date();
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState([{label: ""}, {description: ""}]);
  const [numGrades, setNumGrades] = useState(5);
  const [waiting, setWaiting] = useState(false);
  const [isAdvancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
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

    const {title: urlTitle} = router.query;
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

  const toggleAdvancedOptions = () => {
    setAdvancedOptionsOpen(!isAdvancedOptionsOpen);
  };

  const toggleAddCandidateM = () => {
    setAddCandidateMOpen(!isAddCandidateMOpen);
  };

  const addCandidate = () => {
    if (candidates.length < 1000) {
      candidates.push({label: ""});
      setCandidates(candidates);
    }
  };

  const checkFields = () => {
    if (!candidates) {
      return {ok: false, msg: AT_LEAST_2_CANDIDATES_ERROR};
    }

    let numCandidates = 0;
    candidates.forEach((c) => {
      if (c.label !== "") numCandidates += 1;
    });
    if (numCandidates < 2) {
      return {ok: false, msg: AT_LEAST_2_CANDIDATES_ERROR};
    }

    if (!title || title === "") {
      return {ok: false, msg: NO_TITLE_ERROR};
    }

    return {ok: true, msg: "OK"};
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
  const toggle = () => setVisibility(!visibled)
  const handleSendNotReady = (msg) => {
    toast.error(t(msg), {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const check = checkFields();
  const grades = translateGrades(t);

  const [showModal, setShowModal] = useState(false);

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
      <form onSubmit={handleSubmit} autoComplete="off">
        <Row className="stepForm">
          <Col className="stepFormCol">
            <img src="/icone-one-white.svg" />
            <h4>Les candidats</h4>
          </Col>
          <Col className="stepFormCol">
            <img src="/icone-two-dark.svg" />
            <h4>Paramètres du vote</h4>
          </Col>
          <Col className="stepFormCol">
            <img src="/icone-three-dark.svg" />
            <h4>Confirmation</h4>

          </Col>
        </Row>

        <div className="settings-modal-body">
          <Row>
            <Col xs="10" lg="10">
              <Label for="title">{t("Access to results")} {t("Immediately")}</Label>
              <p>{t("No one will be able to see the result until the end date is reached or until all participants have voted.")}</p>
            </Col>
            <Col l xs="2" lg="2">
              <CustomInput
                type="switch"
                id="restrict_result_false"
                name={handleRestrictResultCheck}
              />
            </Col>
          </Row>
          <hr className="mt-2 mb-2" />
          <Row>
            <Col md="10">
              <Label for="title">{t("Voting time")}</Label>
            </Col>
            <Col l md="2">
              <CustomInput
                type="switch"
                id="is_time_limited_true"
                name={handleIsTimeLimited}
                value={"1"}
              />
            </Col>
          </Row>
          <div
            className={
              (isTimeLimited ? "d-block " : "d-none") + " bg-light p-3"
            }
          >
            <Row>
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
              <Col xs="12" md="3" lg="3">
                <span className="label">- {t("Ending date")}</span>
              </Col>
              <Col xs="6" md="4" lg="3">
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
              <Col xs="6" md="5" lg="3">
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
          </div>
          <hr className="mt-2 mb-2" />
          <Row>
            <Col xs="9">
              <Label>{t("Grades")}</Label>
              <p>{t("You can select here the number of grades for your election")}</p>
            </Col>
            <Col xs="3">
              <div className="numGradesContainer justify-content-end" tabIndex={candidates.length + 3}
                onChange={(e) => setNumGrades(e.target.value)}>
                <Label className="numGrades">
                  <Input type="radio" name="radio" value="5" />
                  <div className="customCheckmarck numGradeFive"></div>
                </Label>
                <Label className="numGrades">
                  <Input type="radio" checked="checked" name="radio" value="6" />
                  <div className="customCheckmarck numGradeSix"></div>
                </Label>
                <Label className="numGrades">
                  <Input type="radio" name="radio" value="7" />
                  <div className="customCheckmarck numGradeSeven"></div>
                </Label>
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
                    className="badge badge-light mr-2 mt-2 "
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
          <hr className="mt-2 mb-2" />
          <Row>
            <Col xs="10" lg="10">
              <Label for="title">{t("Vote privée")}</Label>
              <p>{t("Uniquement les personnes invités par mail pourront participé au vote")}</p>
            </Col>
            <Col l xs="2" lg="2">
              <CustomInput
                type="switch"
                id="restrict_vote_false"
                name={handleRestrictVote}
              />
            </Col>
          </Row>
          <hr className="mt-2 mb-2" />
          <Row>
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
          <hr className="mt-2 mb-2" />
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

            <Button onClick={toggle} className="cursorPointer btn-validation mb-5" >{t("Confirm")}<img src="/arrow-white.svg" /></Button>

          )}
        </div></form>


    </Container >
  );
};

export default CreateElection;

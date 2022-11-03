import {useTranslation} from "next-i18next";
import {useState} from "react";
import Footer from "@components/layouts/Footer";
import TrashButton from "./TrashButton";
import {
  faExclamationTriangle,
  faCheck,
  faArrowLeft,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Input} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ConfirmModal = ({CreateElection, handleRestrictResultCheck, handleIsTimeLimited, tabIndex, title, candidates, grades, isTimeLimited, start, finish, emails, restrictResult, className, confirmCallback, onSubmit}) => {
  const [visibled, setVisibility] = useState(false);
  const {t} = useTranslation();
  const toggle = () => setVisibility(!visibled)

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


  return (
    <div className="input-group-append">
      <Button onClick={toggle}
        tabIndex={tabIndex} className={"mt-5 componentDesktop btn-transparent cursorPointer btn-validation mb-5 mx-auto" + className} >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
      <Button

        className={"componentMobile btn-confirm-mobile mb-5" + className}
        onClick={toggle}
        tabIndex={tabIndex}>
        <FontAwesomeIcon className="mr-2" icon={faCheck} />
        {t("Valider")}
      </Button>

      <Modal
        isOpen={!visibled}
        toggle={toggle}
        className="modal-dialog-centered settings-modal"
      >
        <ModalHeader className="modal-header-settings">
          <div onClick={toggle} className="btn-return-candidates"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Retour aux paramètres</div>
          <Row>
            <Row className="stepForm">
              <Col className="stepFormCol">
                <img src="/icone-check-dark.svg" />
                <h4>Les candidats</h4>
              </Col>
              <Col className="stepFormCol">
                <img src="/icone-check-dark.svg" />
                <h4>Paramètres du vote</h4>
              </Col>
              <Col className="stepFormCol">
                <img src="/icone-three-white.svg" />
                <h4>Confirmation</h4>
              </Col>
            </Row>
          </Row>
        </ModalHeader>
        <ModalBody className="confirm-modal-body">
          <Row>
            <Col md="4" className="p-0">
              <div className="text-light componentDesktop">{t("Le vote")}</div>
              <div className="text-light componentMobile">{t("Confirmation du vote")}</div>
              <div className="mt-1 mb-1 recap-vote">
                <Col className="px-0 bg-white">
                  <Row className="m-0">
                    <div className="recap-vote-label">
                      {t("Question of the election")}
                    </div>
                  </Row>
                  <Row>
                    <div className="p-2 pl-3 pr-3 mb-3 recap-vote-question">{title}</div>

                  </Row>
                </Col>
                <hr className="confirmation-divider" />
                <Col className="px-0 bg-white">
                  <Row>
                    <div className="recap-vote-label p-2 pl-3 pr-3 ">
                      {t("Candidates/Proposals")}
                    </div>
                  </Row>
                  <Row>
                    <div className="p-2 mb-3 recap-vote-content">
                      <ul className="m-0 p-2">
                        {candidates.map((candidate, i) => {
                          if (candidate.label !== "") {
                            return (
                              <li key={i} className="m-0 d-flex justify-content-between">
                                <div className="d-flex">
                                  <div className="avatarThumb mr-2">
                                    <img src="" alt="" />
                                  </div>
                                  {candidate.label}
                                </div>
                                <TrashButton />
                              </li>
                            );
                          } else {
                            return <li key={i} className="d-none" />;
                          }
                        })}
                      </ul>
                    </div>
                  </Row>
                </Col>
              </div>
            </Col>
            <Col md="8" className="rightColumn">
              <div className="text-light componentDesktop">{t("Les paramètres")}</div>
              <div className="recap-vote">
                <Col className="px-0 bg-white mt-0 mb-1">
                  <Row className="row-label px-3 py-2 m-0">
                    <Col xs="10" lg="10" className="p-0 m-0">
                      <Label htmlFor="title" className="m-0">{t("Access to results")} {t("Immediately")}</Label>

                    </Col>
                    <Col l xs="2" lg="2">
                      <div className="radio-group">
                        <input
                          className="radio"
                          type="radio"
                          name="restrict_result"
                          id="restrict_result_false"
                          onClick={handleRestrictResultCheck}

                          value="0"
                        />
                        <label htmlFor="restrict_result_false" />
                        <input
                          className="radio"
                          type="radio"
                          name="restrict_result"
                          id="restrict_result_true"
                          onClick={handleRestrictResultCheck}
                          checked={restrictResult}
                          value="1"
                        />
                        <label htmlFor="restrict_result_true" />
                        <div className="radio-switch"></div>
                      </div>
                    </Col>
                  </Row>
                  {/* <div className={(isTimeLimited ? "d-block " : "d-none")} >
                  <div className="p-2 pl-3 pr-3 recap-vote-label ">
                    {t("Dates")}
                  </div>
                  <div className="p-2 pl-3 pr-3 recap-vote-content mb-3">
                    {t("The election will take place from")}{" "}
                    <b>
                      {start.toLocaleDateString()}, {t("at")}{" "}
                      {start.toLocaleTimeString()}
                    </b>{" "}
                    {t("to")}{" "}
                    <b>
                      {finish.toLocaleDateString()}, {t("at")}{" "}
                      {finish.toLocaleTimeString()}
                    </b>
                  </div>
                </div> */}
                  <hr className="confirmation-divider-mobile" />


                  <Row className="row-label px-3 py-2 m-0">

                    <Col xs="10" className="p-0 m-0">
                      <Label htmlFor="title" className="m-0">{t("Voting time")}</Label>
                    </Col>
                    <Col l xs="2">

                      <div className="radio-group">
                        <input
                          className="radio"
                          type="radio"
                          name="time_limited"
                          id="is_time_limited_false"
                          onClick={handleIsTimeLimited}
                          value="0"
                        />
                        <label htmlFor="is_time_limited_false" />
                        <input
                          className="radio"
                          type="radio"
                          name="time_limited"
                          id="is_time_limited_true"
                          onClick={handleIsTimeLimited}
                          checked={isTimeLimited}
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
                    <Row className="displayNone date">
                      <Col xs="12" md="5" lg="5">
                        <span className="label">- {t("Starting date")}</span>
                      </Col>
                      <Col xs="12" md="12" lg="6">
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
                      <Col xs="12" md="12" lg="6">
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

                    <Row className="">

                      <Col xs="12" md="12" lg="6" className="time-container">
                        <input
                          className="form-control"
                          type="date"
                          value={dateToISO(finish)}
                          min={dateToISO(start)}
                          dateFormat="MMMM d, yyyy h:mm aa"
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
                      <Col xs="12" md="12" lg="6" className="displayNone">
                        <select
                          className="form-control"
                          value={finish}
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
                  <hr className="confirmation-divider-mobile" />



                  <div className="recap-vote-label p-2 pl-3 pr-3">
                    {t("Grades")}
                  </div>
                  <div className="p-2 pl-3 pr-3 recap-vote-content mb-3">
                    {grades.map((mention, i) => {
                      return i < grades.length ? (
                        <span
                          key={i}
                          className="badge badge-light mr-2 mt-2"
                          style={{
                            backgroundColor: mention.color,
                            color: "#fff"
                          }}
                        >
                          {mention.label}
                        </span>
                      ) : (
                        <span key={i} />
                      );
                    })}
                  </div>
                  <hr className="confirmation-divider" />

                  <hr className="confirmation-divider" />
                  <div className="recap-vote-label p-2 pl-3 pr-3 rounded">
                    {t("Voters' list")}
                  </div>
                  <div className="p-2 pl-3 pr-3 recap-vote-content mb-3">
                    {emails.length > 0 ? (
                      emails.join(", ")
                    ) : (
                      <p>
                        {t("The form contains no address.")}
                        <br />
                        <em>
                          {t(
                            "The election will be opened to anyone with the link"
                          )}
                        </em>
                      </p>
                    )}
                  </div>
                  <hr className="confirmation-divider" />
                  {restrictResult ? (
                    <div>
                      <div className="small recap-vote-label p-3 mt-2 ">
                        <h6 className="m-0 p-0 recap-vote-content">
                          {t("Results available at any time")}
                        </h6>
                      </div>
                    </div>

                  ) : (
                    <div>
                      <div className="small recap-vote-label p-3 mt-2">
                        <h6 className="m-0 p-0 recap-vote-content">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="mr-2"
                          />
                          <u>{t("Results available at the close of the vote")}</u>
                        </h6>
                        <p className="m-2 p-0 ">
                          <span>
                            {t(
                              "The results page will not be accessible until the end date is reached."
                            )}{" "}
                            ({finish.toLocaleDateString()} {t("at")}{" "}
                            {finish.toLocaleTimeString()})
                          </span>
                        </p>
                      </div>
                    </div>
                  )}</Col>
              </div>

            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>

          <Button onClick={() => {confirmCallback();}} className="cursorPointer btn-transparent btn-validation mb-5 ml-auto mr-auto" >{t("Start the election")}<img src="/arrow-white.svg" /></Button>
        </ModalFooter>
        <Footer />
      </Modal>
    </div >
  )
}

export default ConfirmModal

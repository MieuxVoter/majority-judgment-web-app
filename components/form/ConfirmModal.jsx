import { useTranslation } from "next-i18next";
import { useState } from "react";
import TrashButton from "./TrashButton";
import {
  faExclamationTriangle,
  faCheck,
  faArrowLeft,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ConfirmModal = ({ tabIndex, title, candidates, grades, isTimeLimited, start, finish, emails, restrictResult, className, confirmCallback }) => {
  const [visibled, setVisibility] = useState(false);
  const { t } = useTranslation();
  const toggleConfirm = () => setVisibility(!visibled)

  return (
    <div className="input-group-append">
       <Button  onClick={toggleConfirm}
        tabIndex={tabIndex} className={"mt-5 componentDesktop btn-transparent cursorPointer btn-validation mb-5 mx-auto" + className} >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
                <Button

                  className={"componentMobile btn-confirm-mobile mb-5" + className}
                  onClick={toggleConfirm}
                  tabIndex={tabIndex}>
                  <FontAwesomeIcon className="mr-2" icon={faCheck} />
                  {t("Valider")}
                </Button>

      <Modal
        isOpen={!visibled}
        toggleConfirm={toggleConfirm}
        className="modal-dialog-centered settings-modal"
      >
        <ModalHeader className="modal-header-settings">
          <div onClick={toggleConfirm} className="btn-return-candidates"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Retour aux paramètres</div>
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
              <div className="text-light">{t("Le vote")}</div>
              <div className="mt-1 mb-1 recap-vote">
                <Row className="m-0">
                  <div className="recap-vote-label">
                    {t("Question of the election")}
                  </div>
                </Row>
                <Row>
                  <div className="p-2 pl-3 pr-3 mb-3 recap-vote-question">{title}</div>
                </Row>
                <hr className="confirmation-divider"/>
                <Row>
                  <div className="recap-vote-label p-2 pl-3 pr-3 ">
                    {t("Candidates/Proposals")}
                  </div>
                </Row>
                <Row>
                  <div className="p-2 pl-3 pr-3 mb-3 recap-vote-content">
                    <ul className="m-0 pl-4">
                      {candidates.map((candidate, i) => {
                        if (candidate.label !== "") {
                          return (
                            <li key={i} className="m-0">
                              {candidate.label}

                            </li>
                          );
                        } else {
                          return <li key={i} className="d-none" />;
                        }
                      })}
                    </ul>
                  </div>
                </Row>
              </div>
            </Col>
            <Col md="8">
              <div className="text-light">{t("Les paramètres")}</div>
              <div className="recap-vote">
                <div className={(isTimeLimited ? "d-block " : "d-none")} >
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
                </div>
                <hr className="confirmation-divider"/>
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
                <hr className="confirmation-divider"/>
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
                <hr className="confirmation-divider"/>
                {restrictResult ? (
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
                ) : (
                  <div>
                    <div className="small recap-vote-label p-3 mt-2 ">
                      <h6 className="m-0 p-0 recap-vote-content">
                        {t("Results available at any time")}
                      </h6>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          
          <Button onClick={() => {confirmCallback(); }} className="cursorPointer btn-transparent btn-validation mb-5 ml-auto mr-auto" >{t("Start the election")}<img src="/arrow-white.svg" /></Button>
        </ModalFooter>
      </Modal>
    </div >
  )
}

export default ConfirmModal

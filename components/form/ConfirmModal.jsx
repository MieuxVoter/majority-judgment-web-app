import {useTranslation} from "next-i18next";
import {useState} from "react";
import {
  faExclamationTriangle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ConfirmModal = ({tabIndex, title, candidates, grades, isTimeLimited, start, finish, emails, restrictResult, className, confirmCallback}) => {
  const [visibled, setVisibility] = useState(false);
  const {t} = useTranslation();
  const toggle = () => setVisibility(!visibled)

  return (
    <div className="input-group-append">
      <button
        type="button"
        className={className}
        onClick={toggle}
        tabIndex={tabIndex}
      >
        <FontAwesomeIcon icon={faCheck} className="mr-2" />
        {t("Validate")}
      </button>
      <Modal
        isOpen={visibled}
        toggle={toggle}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggle}>
          {t("Confirm your vote")}
        </ModalHeader>
        <ModalBody>
          <div className="mt-1 mb-1">
            <div className="text-white bg-primary p-2 pl-3 pr-3 rounded">
              {t("Question of the election")}
            </div>
            <div className="p-2 pl-3 pr-3 bg-light mb-3">{title}</div>
            <div className="text-white bg-primary p-2 pl-3 pr-3 rounded">
              {t("Candidates/Proposals")}
            </div>
            <div className="p-2 pl-3 pr-3 bg-light mb-3">
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
            <div className={(isTimeLimited ? "d-block " : "d-none")} >
              <div className="text-white bg-primary p-2 pl-3 pr-3 rounded">
                {t("Dates")}
              </div>
              <div className="p-2 pl-3 pr-3 bg-light mb-3">
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
            <div className="text-white bg-primary p-2 pl-3 pr-3 rounded">
              {t("Grades")}
            </div>
            <div className="p-2 pl-3 pr-3 bg-light mb-3">
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
            <div className="text-white bg-primary p-2 pl-3 pr-3 rounded">
              {t("Voters' list")}
            </div>
            <div className="p-2 pl-3 pr-3 bg-light mb-3">
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
            {restrictResult ? (
              <div>
                <div className="small bg-primary text-white p-3 mt-2 rounded">
                  <h6 className="m-0 p-0">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="mr-2"
                    />
                    <u>{t("Results available at the close of the vote")}</u>
                  </h6>
                  <p className="m-2 p-0">
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
                <div className="small bg-primary text-white p-3 mt-2 rounded">
                  <h6 className="m-0 p-0">
                    {t("Results available at any time")}
                  </h6>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary-outline"
            className="text-primary border-primary"
            onClick={toggle}>
            {t("Cancel")}
          </Button>
          <Button color="primary"
            onClick={() => {toggle(); confirmCallback();}}
          >
            {t("Start the election")}
          </Button>
        </ModalFooter>
      </Modal>
    </div >
  )
}

export default ConfirmModal

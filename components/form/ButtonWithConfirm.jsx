import {useState} from "react";
import {
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTranslation} from "next-i18next";

const ButtonWithConfirm = ({className, label, onDelete}) => {
  const [visibled, setVisibility] = useState(false);
  const {t} = useTranslation();

  const toggle = () => setVisibility(!visibled)

  return (
    <div className="input-group-append">
      <button
        type="button"
        className={className}
        onClick={toggle}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      <Modal
        isOpen={visibled}
        toggle={toggle}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggle}>{t("Delete?")}</ModalHeader>
        <ModalBody>
          {t("Are you sure to delete")}{" "}
          {label && label !== "" ? (
            <b>&quot;{label}&quot;</b>
          ) : (
            <>{t("the row")}</>
          )}{" "}
                ?
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary-outline"
            className="text-primary border-primary"
            onClick={toggle}>
            {t("No")}
          </Button>
          <Button color="primary"
            onClick={() => {toggle(); onDelete();}}
          >
            {t("Yes")}
          </Button>
        </ModalFooter>
      </Modal>
    </div >
  );
}

export default ButtonWithConfirm;

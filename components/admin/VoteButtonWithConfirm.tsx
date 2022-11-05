import {useState} from "react";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTranslation} from "next-i18next";

const VoteButtonWithConfirm = ({action}) => {
  const [visibled, setVisibility] = useState(false);
  const {t} = useTranslation();

  const toggle = () => setVisibility(!visibled)

  return (
    <div className="input-group-append cancelButton">
      <button
        type="button"
        className="btn btn-transparent my-3 "
        onClick={toggle}
      >
        <div className="annuler">
          <FontAwesomeIcon icon={faCheck} className="mr-2 my-auto" />
          {t("Submit my vote")}
        </div>
      </button>
      <Modal
        isOpen={visibled}
        toggle={toggle}
        className="noRateVote"
      >
        <ModalHeader>{t("Attention vous n’avez pas votez pour tous les candidats")}</ModalHeader>
        <ModalBody>
          {t("Si vous validez votre vote, les candidats sans vote auront la mention la plus basse du scrutin.")}


          <Button
            className="addButton warningVote my-4"
            onClick={() => {action();}}>
            {t("Validez mon vote")}<img src="/arrow-white.svg" />

          </Button>
          <Button
            className="removeButton backToVoteBtn my-4"
            onClick={toggle}
          >
            {t("Revenir au vote")}
          </Button>
        </ModalBody>
      </Modal>
    </div >
  );
}

export default VoteButtonWithConfirm;

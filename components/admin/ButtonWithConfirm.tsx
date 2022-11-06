import { useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'next-i18next';

const ButtonWithConfirm = ({ className, label, onDelete }) => {
  const [visibled, setVisibility] = useState(false);
  const { t } = useTranslation();

  const toggle = () => setVisibility(!visibled);

  return (
    <div className="input-group-append cancelButton">
      <button type="button" className={'btn ' + className} onClick={toggle}>
        <div className="annuler">
          <img src="/arrow-dark-left.svg" />
          <p>Annuler</p>
        </div>
      </button>
      <Modal
        isOpen={visibled}
        toggle={toggle}
        className="modal-dialog-centered cancelForm"
      >
        <ModalHeader>
          <FontAwesomeIcon icon={faTrashAlt} />
        </ModalHeader>
        <ModalBody>
          {t('Are you sure to delete')}
          {<br />}
          {label && label !== '' ? <b>{label}</b> : <>{t('the row')}</>}
        </ModalBody>
        <ModalFooter>
          <Button className={className} onClick={toggle}>
            <div className="annuler">
              <img src="/arrow-dark-left.svg" /> {t('No')}
            </div>
          </Button>
          <Button
            className="new-btn-confirm"
            onClick={() => {
              toggle();
              onDelete();
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            {t('Yes')}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ButtonWithConfirm;

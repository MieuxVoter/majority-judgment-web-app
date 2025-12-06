import { useState } from 'react';
import Image from 'next/image';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'next-i18next';

const TrashButton = ({ className, label, onClick }) => {
  const [visibled, setVisibility] = useState(false);
  const { t } = useTranslation();

  const toggle = () => setVisibility(!visibled);

  return (
    <div className="input-group-append cancelButton">
      <FontAwesomeIcon onClick={toggle} icon={faTrashAlt} role="button" />
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
          <Button type="button" className={className} onClick={toggle}>
            <div className="annuler">
              <Image src="/arrow-dark-left.svg" width={16} height={16} alt="arrow" /> {t('No')}
            </div>
          </Button>
          <Button
            className="new-btn-confirm"
            onClick={() => {
              toggle();
              onClick();
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

export default TrashButton;

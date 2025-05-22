import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import {Button, Modal, ModalBody} from 'reactstrap';

const ConfirmRevertCustomGradesModal = ({isOpen, onConfirm, toggle})=> {
  const {t} = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_grade"
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.revert-custom-grades')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <p>{t('admin.revert-custom-grades-desc')}</p>

        <div className="mt-3 gap-2 d-flex mb-3 justify-content-between">
            <Button
              color="dark"
              onClick={toggle}
              className=""
              outline={true}
              icon={faArrowLeft}
            >
              {t('common.cancel')}
            </Button>
            <Button
            color="danger"
            outline={true}
            onClick={onConfirm}
            >
            {t('admin.step-confirm')}
            </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default ConfirmRevertCustomGradesModal;
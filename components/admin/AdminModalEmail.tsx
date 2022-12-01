import {useState} from 'react';
import {Input, Modal, ModalBody, Form} from 'reactstrap';
import {faArrowLeft, faCheck} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import Button from '@components/Button';
import ButtonCopy from '@components/ButtonCopy';
import {sendAdminMail, validateMail} from '@services/mail';
import {getUrlAdmin} from '@services/routes';
import {useElection} from '@services/ElectionContext';


interface AdminModalEmailInterface {
  isOpen: boolean;
  toggle: () => void;
  electionRef: string | null;
  adminToken: string | null;
}

const AdminModalEmail = ({isOpen, toggle, electionRef, adminToken}: AdminModalEmailInterface) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState(undefined);
  const election = useElection();

  const adminUrl = electionRef && adminToken ? getUrlAdmin(electionRef, adminToken) : null;

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = () => {
    console.log(election);
    sendAdminMail(email, election.name, adminUrl);
    toggle();
  };

  const disabled = !email || !validateMail(email);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.modal-title')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <p>{t('admin.modal-desc')}</p>
        <div className="d-grid w-100 mb-5">
          <ButtonCopy text={t('admin.success-copy-admin')} content={adminUrl} />
        </div>
        <p>{t('admin.modal-email')}</p>
        <p className="text-muted">{t('admin.modal-disclaimer')}</p>
        <Form className="container container-fluid">
          <div className="mb-3">
            <Input
              type="text"
              placeholder={t('admin.modal-email-placeholder')}
              value={email}
              onChange={handleEmail}
              autoFocus
              required
            />
          </div>
          <div className="mt-5 gap-2 d-grid mb-3 d-md-flex">
            <Button
              onClick={toggle}
              color="dark"
              className="me-md-auto"
              outline={true}
              icon={faArrowLeft}
            >
              {t('common.cancel')}
            </Button>
            <Button
              disabled={disabled}
              color="primary"
              position="right"
              onClick={handleSubmit}
              icon={faCheck}
            >
              {t('common.send')}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default AdminModalEmail;

import {useState} from 'react';
import {Input, Modal, ModalBody, Form} from 'reactstrap';
import {faArrowLeft, faCheck, faDownload} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import Button from '@components/Button';
import ButtonCopy from '@components/ButtonCopy';
import {sendAdminMail, validateMail} from '@services/mail';
import {getUrl, RouteTypes} from '@services/routes';
import {useElection} from '@services/ElectionContext';
import {getLocaleShort} from '@services/utils';
import {useRouter} from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AdminModalEmailInterface {
  isOpen: boolean;
  toggle: () => void;
  electionRef: string | null;
  adminToken: string | null;
}

const AdminModalEmail = ({
  isOpen,
  toggle,
  electionRef,
  adminToken,
}: AdminModalEmailInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState(undefined);
  const [election, _] = useElection();
  const locale = getLocaleShort(router);

  const adminUrl =
    electionRef && adminToken
      ? getUrl(RouteTypes.ADMIN, locale, electionRef, adminToken)
      : null;

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    const locale = getLocaleShort(router);
    sendAdminMail(email, election.name, locale, adminUrl);
    toggle();
  };

  const handleDownloadAdminShortcut = () => {
    if (!adminUrl) return;
    
    let filename, content, type;
    
    // Détection de plateforme plus précise
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac = /macintosh|mac os x/i.test(userAgent);
    const isWindows = /windows/.test(userAgent);
    
    if (isWindows) {
      // Format Windows .url
      filename = 'admin.url';
      content = `[InternetShortcut]\nURL=${adminUrl}\n`;
      type = 'text/plain';
    } else if (isMac) {
      // Format macOS .webloc (XML)
      filename = 'admin.webloc';
      content = `<?xml version="1.0" encoding="UTF-8"?>
  DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    <key>URL</key>
    <string>${adminUrl}</string>
  </dict>
</plist>`;
      type = 'application/xml';
    } else {
      // Format Linux .desktop
      filename = 'admin.desktop';
      content = `[Desktop Entry]\nVersion=1.0\nType=Link\nName=Admin\nURL=${adminUrl}\nIcon=internet-shortcut\n`;
      type = 'text/plain';
    }
    
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  const disabled = !email || !validateMail(email);

  return (
    <Modal isOpen={isOpen} toggle={toggle} keyboard={true}>
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
          <Button
            className="bg-white text-black my-2 shadow-lg border-dark border py-3 px-4 border-3 justify-content-between gx-2 align-items-end"
            onClick={handleDownloadAdminShortcut}
          >
            <div>{"Download admin shortcut"}</div>
            <div>
              <FontAwesomeIcon icon={faDownload} />
            </div>
          </Button>
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

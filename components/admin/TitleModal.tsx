import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Label, Modal, ModalBody, Form } from 'reactstrap';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import { ElectionTypes, useElection } from '@services/ElectionContext';
import Button from '@components/Button';
import { checkName } from '@services/ElectionContext';
import { AppTypes, useAppContext } from '@services/context';
import { useRouter } from 'next/router';

const TitleModal = ({ isOpen, toggle }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const [name, setName] = useState(election.name);
  const disabled = name === '';

  const inputRef = useRef(null);

  useEffect(() => {
    setName(election.name);
  }, [election.name]);

  useEffect(() => {
    // When isOpen got active, we put the focus on the input field
    setTimeout(() => {
      console.log(inputRef.current);
      if (isOpen && inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [isOpen]);

  const save = (e) => {
    e.preventDefault();

    if (name === '') {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.empty-name'),
      });
      return;
    }

    dispatch({
      type: ElectionTypes.SET,
      field: 'name',
      value: name,
    });

    toggle();
  };

  // check if key down is enter
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      save(e);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_candidate"
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.set-title')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <Form className="container container-fluid" onKeyDown={handleKeyDown}>
          <div className="mb-3">
            <Label className="fw-bold">{t('common.name')} </Label>
            <input
              type="text"
              placeholder={t('home.writeQuestion')}
              value={name}
              onChange={handleName}
              required
              className="form-control"
              ref={inputRef}
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
            <div onClick={save}>
              <Button
                color={disabled ? 'light' : 'primary'}
                disabled={disabled}
                icon={faPlus}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default TitleModal;

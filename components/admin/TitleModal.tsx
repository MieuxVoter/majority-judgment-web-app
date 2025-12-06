import {useState, useEffect, useRef, KeyboardEvent} from 'react';
import {Label, Modal, ModalBody, Form, FormFeedback, Input} from 'reactstrap';
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import {
  ElectionTypes,
  useElection,
  NAME_MAX_LENGTH,
  NAME_ERROR_CODE,
} from '@services/ElectionContext';
import Button from '@components/Button';
import {AppTypes, useAppContext} from '@services/context';

const TitleModal = ({isOpen, toggle}) => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const [name, setName] = useState(election.name);

  const isNameInvalid = name != null && name.length > NAME_MAX_LENGTH;
  const disabled = name === '' || isNameInvalid;

  const inputRef = useRef(null);

  useEffect(() => {
    // When isOpen got active, we put the focus on the input field
    setTimeout(() => {
      if (isOpen && inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [isOpen]);

  useEffect(() => {
    if (isNameInvalid) {
      dispatch({ type: ElectionTypes.ADD_ERROR, value: NAME_ERROR_CODE });
    } else {
      dispatch({ type: ElectionTypes.REMOVE_ERROR, value: NAME_ERROR_CODE });
    }
  }, [isNameInvalid, dispatch]);

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
            <Input
              type="text"
              placeholder={t('home.writeQuestion')}
              value={name}
              onChange={handleName}
              required
              invalid={isNameInvalid}
              innerRef={inputRef}
              maxLength={NAME_MAX_LENGTH}
            />
            <div className={`text-end small ${isNameInvalid ? 'text-danger' : 'text-muted'}`}>
              {name == null ? 0 : name.length} / {NAME_MAX_LENGTH}
            </div>
            {isNameInvalid && (
              <FormFeedback>{t('error.name-too-long', { maxLength: NAME_MAX_LENGTH })}</FormFeedback>
            )}
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

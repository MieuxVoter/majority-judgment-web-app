import {useState, useEffect, useRef, KeyboardEvent} from 'react';
import {Row, Col, Label, Input, Modal, ModalBody, Form} from 'reactstrap';
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import Button from '@components/Button';
import {upload} from '@services/imgpush';
import {IMGPUSH_URL} from '@services/constants';
import {AppTypes, useAppContext} from '@services/context';
import defaultAvatar from '../../public/default-avatar.svg';

const CandidateModal = ({isOpen, position, toggle}) => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();
  const candidate = election.candidates[position];
  const [state, setState] = useState(candidate);
  const image = state.image && state.image != '' ? state.image : defaultAvatar;

  const handleFile = async (event) => {
    const payload = await upload(event.target.files[0]);
    setState((s) => ({...s, image: `${IMGPUSH_URL}/${payload['filename']}`}));
  };

  const [app, dispatchApp] = useAppContext();

  // to manage the hidden ugly file input
  const hiddenFileInput = useRef(null);

  const inputRef = useRef(null);

  const names = election.candidates
    .filter((_, i) => i != position)
    .map((c) => c.name);
  const disabled = state.name === '' || names.includes(state.name);

  useEffect(() => {
    setState(election.candidates[position]);
  }, [election]);

  useEffect(() => {
    // When isOpen got active, we put the focus on the input field
    setTimeout(() => {
      if (isOpen && inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [isOpen]);

  // check if key down is enter
  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Enter') {
      save(e);
    }
  };

  const save = (e) => {
    e.preventDefault();

    if (state.name === '') {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.empty-name'),
      });
      return;
    }
    if (names.includes(state.name)) {
      alert('foo');
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.twice-same-names'),
      });
      return;
    }

    dispatch({
      type: ElectionTypes.CANDIDATE_SET,
      position: position,
      field: 'image',
      value: state.image,
    });
    dispatch({
      type: ElectionTypes.CANDIDATE_SET,
      position: position,
      field: 'name',
      value: state.name,
    });
    dispatch({
      type: ElectionTypes.CANDIDATE_SET,
      position: position,
      field: 'description',
      value: state.description,
    });
    toggle();
  };

  const handleName = (e) => {
    setState((s) => ({...s, name: e.target.value}));
  };

  const handleDescription = (e) => {
    setState((s) => ({...s, description: e.target.value}));
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_candidate"
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.add-candidate')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <p>{t('admin.add-candidate-desc')}</p>
        <Col>
          <Form className="container container-fluid" onKeyDown={handleKeyDown}>
            <div className="my-3">
              <Label className="fw-bold">{t('common.name')} </Label>
              <input
                className="form-control"
                type="text"
                placeholder={t('admin.candidate-name-placeholder')}
                tabIndex={position + 1}
                value={state.name}
                onChange={handleName}
                maxLength={250}
                autoFocus={true}
                required={true}
                ref={inputRef}
              />
            </div>
            <Label className="fw-bold">
              {t('admin.photo')}{' '}
              <span className="text-muted"> ({t('admin.optional')})</span>
            </Label>
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-between justify-content-center align-items-center">
              <Image
                src={image}
                alt={t('admin.photo')}
                height={120}
                width={120}
              />
              <div className="mb-3">
                <p>{t('admin.photo-type')} jpg, png, pdf</p>
                <div className="w-100 d-md-block d-grid">
                  <input
                    type="file"
                    className="hide"
                    onChange={handleFile}
                    ref={hiddenFileInput}
                  />
                  <Button
                    color="dark"
                    outline={true}
                    onClick={() => hiddenFileInput.current.click()}
                  >
                    {t('admin.photo-import')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Label className="fw-bold">
                {t('common.description')}{' '}
                <span className="text-muted"> ({t('admin.optional')})</span>
              </Label>
              <textarea
                rows={3}
                className="form-control"
                placeholder={t('admin.candidate-desc-placeholder')}
                onChange={handleDescription}
                value={state.description}
              />
            </div>
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
              {
                // Since we disabled the button, the onCLick is supported by another component
              }
              <div onClick={save}>
                <Button
                  color={disabled ? 'light' : 'primary'}
                  position="right"
                  disabled={disabled}
                  icon={faPlus}
                  role="submit"
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </ModalBody>
    </Modal>
  );
};
export default CandidateModal;

import { useState, useEffect, useRef } from 'react';
import { Row, Col, Label, Input, Modal, ModalBody, Form } from 'reactstrap';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useElection, useElectionDispatch } from './ElectionContext';
import Button from '@components/Button';
import { upload } from '@services/imgpush';
import { IMGPUSH_URL } from '@services/constants';
import defaultAvatar from '../../public/default-avatar.svg';

const CandidateModal = ({ isOpen, position, toggle }) => {
  const { t } = useTranslation();
  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const [state, setState] = useState(candidate);
  const image = state.image && state.image != '' ? state.image : defaultAvatar;

  const handleFile = async (event) => {
    const payload = await upload(event.target.files[0]);
    setState((s) => ({ ...s, image: `${IMGPUSH_URL}/${payload['filename']}` }));
  };

  // to manage the hidden ugly file input
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    setState(election.candidates[position]);
    console.log('effect election', election);
  }, [election]);

  const save = () => {
    dispatch({
      type: 'candidate-set',
      position: position,
      field: 'image',
      value: state.image,
    });
    dispatch({
      type: 'candidate-set',
      position: position,
      field: 'name',
      value: state.name,
    });
    dispatch({
      type: 'candidate-set',
      position: position,
      field: 'description',
      value: state.description,
    });
    toggle();
  };

  const handleName = (e) => {
    setState((s) => ({ ...s, name: e.target.value }));
  };

  const handleDescription = (e) => {
    setState((s) => ({ ...s, description: e.target.value }));
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
          <Form className="container container-fluid">
            <Row className="gx-4 mb-3">
              <Col className="col-auto">
                <Image
                  src={image}
                  alt={t('admin.photo')}
                  height={120}
                  width={120}
                />
              </Col>
              <Col className="col-auto">
                <Label className="fw-bold">
                  {t('admin.photo')}{' '}
                  <span className="text-muted"> ({t('admin.optional')})</span>
                </Label>
                <p>{t('admin.photo-type')} jpg, png, pdf</p>
                <div>
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
              </Col>
            </Row>
            <div className="mb-3">
              <Label className="fw-bold">{t('common.name')} </Label>
              <Input
                type="text"
                placeholder={t('admin.candidate-name-placeholder')}
                tabIndex={position + 1}
                value={state.name}
                onChange={handleName}
                // maxLength="250"
                autoFocus
                required
              />
            </div>
            <div className="">
              <Label className="fw-bold">
                {t('common.description')}{' '}
                <span className="text-muted"> ({t('admin.optional')})</span>
              </Label>
              <Input
                type="text"
                defaultValue={candidate.description}
                placeholder={t('admin.candidate-desc-placeholder')}
                onChange={handleDescription}
                value={state.description}
                // maxLength="250"
              />
            </div>
            <Row className="mt-5 mb-3">
              <Col className="col-auto me-auto">
                <Button
                  onClick={toggle}
                  color="dark"
                  outline={true}
                  icon={faArrowLeft}
                >
                  {t('common.cancel')}
                </Button>
              </Col>
              <Col className="col-auto ">
                <Button
                  outline={true}
                  color="primary"
                  onClick={save}
                  icon={faPlus}
                >
                  {t('common.save')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </ModalBody>
    </Modal>
  );
};
export default CandidateModal;

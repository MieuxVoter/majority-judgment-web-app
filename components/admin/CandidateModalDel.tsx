import {Row, Col, Label, Input, Modal, ModalBody, Form} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faTrashCan,
  faTrashAlt,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import {useElection, useElectionDispatch} from '@services/ElectionContext';
import Button from '@components/Button';
import {upload} from '@services/imgpush';
import {IMGPUSH_URL} from '@services/constants';
import defaultAvatar from '../../public/default-avatar.svg';
import {useEffect} from 'react';

const CandidateModal = ({isOpen, position, toggle}) => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];

  const removeCandidate = () => {
    dispatch({type: 'candidate-rm', position: position});
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_candidate"
    >
      <ModalBody className="flex-column justify-contenter-center d-flex p-4">
        <Row className="justify-content-center">
          <Col className="col-auto px-4 py-4 rounded-circle bg-light">
            <FontAwesomeIcon size="2x" icon={faTrashCan} />
          </Col>
        </Row>
        <p className="text-danger fw-bold text-center mt-4">
          {t('admin.candidate-confirm-del')}
        </p>
        {candidate.name ? (
          <h4 className="text-center">{candidate.name}</h4>
        ) : null}
        <div className="mt-5 gap-2 d-grid mb-3 d-md-flex">
          <Button
            onClick={toggle}
            color="dark"
            icon={faArrowLeft}
            outline={true}
            className="me-md-auto"
          >
            {t('admin.candidate-confirm-back')}
          </Button>
          <Button icon={faTrashAlt} color="danger" onClick={removeCandidate}>
            {t('admin.candidate-confirm-ok')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default CandidateModal;

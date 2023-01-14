
/**
 * A modal to details a candidate
 */
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import Image from 'next/image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {CandidatePayload} from '@services/api';
import defaultAvatar from '../public/avatarBlue.svg';


interface CandidateModal {
  isOpen: boolean;
  toggle: Function;
  candidate: CandidatePayload;
}

const CandidateModal = ({isOpen, toggle, candidate}) => {

  return (
    < Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_candidate"
      centered={true}
    >
      <div className="w-100 h-100 p-4 bg-white">
        <div className="d-flex justify-content-between mb-4">
          <Image
            src={candidate && candidate.image ? candidate.image : defaultAvatar}
            height={96}
            width={96}
            alt={candidate && candidate.name}
            className="rounded-circle bg-light"
          />
          <FontAwesomeIcon onClick={toggle} icon={faXmark} />
        </div>
        <div className="px-2">
          <h5>{candidate && candidate.name}</h5>
          <p>{candidate && candidate.description}</p>
        </div>
      </div>
    </Modal >
  )
};

export default CandidateModal;

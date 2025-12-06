
/**
 * A modal to details a candidate
 */
import { Modal } from 'reactstrap';
import Image from 'next/image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {CandidatePayload} from '@services/api';
import defaultAvatar from '../public/avatarBlue.svg';


interface CandidateModal {
  isOpen: boolean;
  toggle: () => void;
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
            width={256}
            height={256}
            style={{ 
              width: 'auto', 
              height: '256px', 
              maxWidth: '100%',
              objectFit: 'contain',
              maxHeight: 'min(256px, 80vh)'
            }}
            alt={candidate && candidate.name}
            className="bg-light mx-auto"
          />
          <FontAwesomeIcon onClick={toggle} icon={faXmark} />
        </div>
        <div className="px-2 text-center">
          <h5>{candidate && candidate.name}</h5>
          <p>{candidate && candidate.description}</p>
        </div>
      </div>
    </Modal >
  )
};

export default CandidateModal;

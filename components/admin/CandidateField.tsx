/**
 * This is the candidate field used during election creation
 */
import {useState} from 'react';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {Row, Col} from 'reactstrap';
import {useElection, useElectionDispatch} from '../../services/ElectionContext';
import whiteAvatar from '../../public/avatar.svg';
import CandidateModalSet from './CandidateModalSet';
import CandidateModalDel from './CandidateModalDel';

interface CandidateProps {
  position: number;
  className?: string;
  defaultAvatar?: any;
  [props: string]: any;
}

const CandidateField = ({
  position,
  className = '',
  defaultAvatar = whiteAvatar,
  ...props
}: CandidateProps) => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;
  const active = candidate && candidate.active === true;

  const [modalDel, setModalDel] = useState(false);
  const [modalSet, setModalSet] = useState(false);

  const addCandidate = () => {
    dispatch({type: 'candidate-push', value: 'default'});
  };

  const toggleSet = () => setModalSet((m) => !m);
  const toggleDel = () => setModalDel((m) => !m);

  const activeClass = active
    ? 'bg-white text-secondary'
    : 'border border-dashed border-2 border-light border-opacity-25';

  return (
    <Row
      className={`${activeClass} align-items-center ${className}`}
      {...props}
    >
      <Col onClick={toggleSet} role="button" className="col-10 me-auto">
        <Row className="gx-3">
          <Col className="col-2 justify-content-start align-items-center d-flex">
            <Image
              src={image}
              width={24}
              height={24}
              className={`${image == defaultAvatar ? 'default-avatar' : ''
                } bg-primary`}
              alt={t('common.thumbnail')}
            />
          </Col>
          <Col className="col-10 fw-bold">
            {candidate.name ? candidate.name : t('admin.add-candidate')}
          </Col>
        </Row>
      </Col>
      <Col role="button" className="col-2 text-end">
        {active ? (
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-warning"
            onClick={() => setModalDel((m) => !m)}
          />
        ) : (
          <FontAwesomeIcon icon={faPlus} onClick={addCandidate} />
        )}
      </Col>
      <CandidateModalSet
        toggle={toggleSet}
        isOpen={modalSet}
        position={position}
      />
      <CandidateModalDel
        toggle={toggleDel}
        isOpen={modalDel}
        position={position}
      />
    </Row>
  );
};

export default CandidateField;

/**
 * This is the candidate field used during election creation
 */
import {useState} from 'react'
import Image from 'next/image'
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {Row, Col} from "reactstrap";
import {useElection, useElectionDispatch} from './ElectionContext';
import defaultAvatar from '../../public/avatar.svg'
import CandidateModalSet from './CandidateModalSet';
import CandidateModalDel from './CandidateModalDel';


const CandidateField = ({position, className, ...inputProps}) => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;
  const active = candidate && candidate.active === true

  const [modalDel, setModalDel] = useState(false);
  const [modalSet, setModalSet] = useState(false);

  const addCandidate = () => {
    dispatch({'type': 'candidate-push', 'value': "default"})
  };

  const toggleSet = () => setModalSet(m => !m)
  const toggleDel = () => setModalDel(m => !m)

  return (
    <Row
      className={`${className || ""} p-2 my-3 border border-dashed border-2 border-light border-opacity-25 align-items-center ${active ? "active" : ""}`}
      {...inputProps}
    >
      <Col onClick={toggleSet} className='cursor-pointer col-auto me-auto'>
        <Row className='gx-3'>
          <Col className='col-auto'>
            <Image src={image} width={24} height={24} className={image == defaultAvatar ? "default-avatar" : ""} alt={t('common.thumbnail')} />
          </Col>
          <Col className='col-auto fw-bold'>
            {t("admin.add-candidate")}
          </Col>
        </Row>
      </Col>
      <Col className='col-auto cursor-pointer'>
        {active ?
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={() => setModalDel(m => !m)}
          /> :
          <FontAwesomeIcon
            icon={faPlus}
            onClick={addCandidate}
          />
        }

      </Col>
      <CandidateModalSet toggle={toggleSet} isOpen={modalSet} position={position} />
      <CandidateModalDel toggle={toggleDel} isOpen={modalDel} position={position} />
    </Row >
  );
}

export default CandidateField;

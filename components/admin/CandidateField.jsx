/**
 * This is the candidate field used during election creation
 */
import {useState} from 'react'
import Image from 'next/image'
import TrashButton from "./TrashButton";
import {Row, Col} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useElection, useElectionDispatch} from './ElectionContext';
import defaultAvatar from '../../public/avatar.svg'
import addIcon from '../../public/add.svg'
import CandidateModal from './CandidateModal';


const CandidateField = ({position, className, ...inputProps}) => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;
  const active = candidate && candidate.active === true

  const [modal, setModal] = useState(false);

  const addCandidate = () => {
    dispatch({'type': 'candidate-push', 'value': "default"})
  };

  const removeCandidate = () => {
    dispatch({'type': 'candidate-rm', 'value': position})
  }

  const toggle = () => setModal(m => !m)

  return (
    <Row
      className={`${className} p-2 my-3 border border-dashed border-dark border-opacity-50 align-items-center ${active ? "active" : ""}`}
      {...inputProps}
    >
      <Col onClick={toggle} className='col-auto me-auto'>
        <Row className='gx-3'>
          <Col className='col-auto'>
            <Image fill src={image} className={image == defaultAvatar ? "default-avatar" : ""} alt={t('common.thumbnail')} />
          </Col>
          <Col className='col-auto fw-bold'>
            {t("admin.add-candidate")}
          </Col>
        </Row>
      </Col>
      <Col className='col-auto'>
        {active ?
          <div className={trashIcon}><TrashButton onClick={removeCandidate} /></div> :
          <Image src={addIcon} onClick={addCandidate} alt={t('admin.add-candidate')} />
        }

      </Col>
      <CandidateModal toggle={toggle} isOpen={modal} position={position} />
    </Row >
  );
}

export default CandidateField;

/**
 * This is the candidate field used during election creation
 */
import {useState} from 'react';
import Image, { StaticImageData } from 'next/image';
import {useTranslation} from 'next-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {useSortable} from '@dnd-kit/sortable';
import {ElectionTypes, useElection, isCreated} from '@services/ElectionContext';
import VerticalGripDots from '@components/VerticalGripDots';
import whiteAvatar from '../../public/avatar.svg';
import CandidateModalSet from './CandidateModalSet';
import CandidateModalDel from './CandidateModalDel';

interface CandidateProps {
  position: number;
  className?: string;
  defaultAvatar?: string | StaticImageData;
  [props: string]: unknown;
}

const CandidateField = ({
  position,
  className = '',
  defaultAvatar = whiteAvatar,
  ...props
}: CandidateProps) => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();

  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;
  const active = candidate && candidate.active === true;

  const [modalDel, setModalDel] = useState(false);
  const [modalSet, setModalSet] = useState(false);

  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id: position + 1});

  const addCandidate = () => {
    if (!isCreated(election)) {
      dispatch({type: ElectionTypes.CANDIDATE_PUSH, value: 'default'});
    }
  };

  const toggleSet = () => setModalSet((m) => !m);
  const toggleDel = () => setModalDel((m) => !m);

  const activeClass = active
    ? 'bg-white text-secondary'
    : 'border border-dashed border-2 border-light border-opacity-25';

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : null,
    transition,
  };

  return (
    <div
      className={`${activeClass} d-flex justify-content-between align-items-center ${className}`}
      ref={setNodeRef}
      style={style}
    >
      <div
        onClick={toggleSet}
        role="button"
        className="py-3 me-1 flex-fill d-flex align-items-center "
      >
        <Image
          src={image}
          width={24}
          height={24}
          className={`${image == defaultAvatar ? 'default-avatar' : ''
            } bg-primary`}
          style={{objectFit: 'cover'}}
          alt={t('common.thumbnail')}
        />
        <div className="ps-2 fw-bold">
          {candidate.name ? candidate.name : t('admin.add-candidate')}
        </div>
      </div>
      {!isCreated(election) && (
        <>
          <div role="button" className="text-end">
            {active ? (
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-black opacity-25"
                onClick={() => setModalDel((m) => !m)}
              />
            ) : (
              <FontAwesomeIcon icon={faPlus} onClick={addCandidate} />
            )}
          </div>

          <div
            {...props}
            {...attributes}
            {...listeners}
            role="button"
            className="text-end ms-3"
          >
            {active ? <VerticalGripDots /> : null}
          </div>
        </>
      )}

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
    </div>
  );
};

export default CandidateField;

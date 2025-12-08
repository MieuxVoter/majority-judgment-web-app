import {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import {useTranslation} from 'next-i18next';
import {Container} from 'reactstrap';
import {DndContext} from '@dnd-kit/core';
import {arrayMove, SortableContext} from '@dnd-kit/sortable';
import {faArrowRight, faPen} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TitleModal from './TitleModal';
import {MAX_NUM_CANDIDATES} from '@services/constants';
import Alert from '@components/Alert';
import Button from '@components/Button';
import {
  ElectionTypes,
  useElection,
  NAME_ERROR_CODE,
  NAME_MAX_LENGTH,
  CANDIDATE_DESCRIPTION_ERROR_CODE,
  CANDIDATE_DESCRIPTION_MAX_LENGTH,
} from '@services/ElectionContext';
import CandidateField from './CandidateField';
import {AppTypes, useAppContext} from '@services/context';
import VerticalGripDots from '@components/VerticalGripDots';

const CandidatesField = ({onSubmit}) => {
  const {t} = useTranslation();
  const submitReference = useRef(null);

  const [, dispatchApp] = useAppContext();

  const [election, dispatch] = useElection();
  const candidates = election.candidates;

  const isNameInvalid = election.errors.includes(NAME_ERROR_CODE);
  const [modalTitle, setModalTitle] = useState(false);
  const toggleModalTitle = () => setModalTitle((m) => !m);

  const error = candidates.length > Number(MAX_NUM_CANDIDATES) ? 'error.too-many-candidates' : null;

  const disabled =
    candidates.filter((c) => c.name !== '').length < 2 ||
    election.errors.length > 0;

  // What to do when we change the candidates
  useEffect(() => {
    // Initialize the list with at least two candidates
    if (candidates.length < 2) {
      dispatch({type: ElectionTypes.CANDIDATE_PUSH, value: 'default'});
    }
  }, [candidates, dispatch]);

  useEffect(() => {
    if (!disabled && submitReference.current) {
      submitReference.current.focus();
    }
  }, [disabled, submitReference]);

  const handleSubmit = (e) => {
    if (candidates.filter((c) => c.name !== '').length < 2) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.at-least-2-candidates'),
      });
    } else if (election.errors.includes(NAME_ERROR_CODE)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.name-too-long', { maxLength: NAME_MAX_LENGTH }),
      });
    } else if (election.errors.includes(CANDIDATE_DESCRIPTION_ERROR_CODE)) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.candidate-description-too-long', { maxLength: CANDIDATE_DESCRIPTION_MAX_LENGTH }),
      });
    } else if (election.errors.length > 0) {
      // Handle other potential errors
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.catch22'),
      });
    } else {
      return onSubmit(e);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key == 'Enter' && !disabled) {
      onSubmit();
    }
  };

  const handleDragEnd = (event) => {
    /**
     * Update the list of grades after dragging an item
     */
    const {active, over} = event;

    if (over && over.id && active.id && active.id !== over.id) {
      const newCandidates = arrayMove(candidates, active.id - 1, over.id - 1);

      dispatch({
        type: ElectionTypes.SET,
        field: 'candidates',
        value: newCandidates,
      });
    }
  };

  const sortIds = election.candidates.map((_, i) => i + 1);

  return (
    <>
      <Container onClick={toggleModalTitle} className="candidate mt-5">
        <h4 className="mb-4">{t('admin.confirm-question')}</h4>
        <div className={`d-flex justify-content-between border border-dashed border-2 px-4 py-3 mx-2 mx-md-0
                         ${isNameInvalid ? 'border-danger' : 'border-light border-opacity-25'}`}>
          <h5 className="m-0 text-white">{election.name}</h5>
          <FontAwesomeIcon icon={faPen} />
        </div>
        {isNameInvalid && (
          <div className="text-danger mt-2 mx-2 mx-md-0">
            {t('error.name-too-long', { maxLength: NAME_MAX_LENGTH })}
          </div>
        )}
        <TitleModal isOpen={modalTitle} toggle={toggleModalTitle} />
      </Container>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={sortIds}>
          <Container className="candidate flex-grow-1 my-5 flex-column d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h4 className="mb-4">{t('admin.add-candidates')}</h4>
              <div className="mb-4">{t('admin.add-candidates-desc')}{" "}
                <VerticalGripDots fill="white" opacity={1} />
              </div>
              <Alert msg={error} />
              <div className="d-flex flex-column mx-2 mx-md-0">
                {candidates.map((_, index) => {
                  return (
                    <CandidateField
                      key={index}
                      position={index}
                      className="px-4 my-3"
                    />
                  );
                })}
              </div>
            </div>

            <div
              className="w-100 mt-3 d-flex justify-content-center"
              onClick={handleSubmit}
            >
              <Button
                outline={true}
                color="secondary"
                className={`bg-blue${disabled ? ' disabled' : ''}`}
                icon={faArrowRight}
                position="right"
                onKeyDown={handleKeyDown}
              >
                {t('admin.candidates-submit')}
              </Button>
            </div>
          </Container>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default CandidatesField;

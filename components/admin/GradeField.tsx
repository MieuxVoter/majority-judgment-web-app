import {useState} from 'react';
import {Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faXmark,
  faCheck,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import {useElection, useElectionDispatch} from '../../services/ElectionContext';

const GradeField = ({value}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((m) => !m);

  const election = useElection();
  const grade = election.grades[value];
  const dispatch = useElectionDispatch();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   dispatch({
  //     type: 'grade-set',
  //     position: value,
  //     field: 'name',
  //     value: e.target.value,
  //   })
  // }

  const handleActive = () => {
    dispatch({
      type: 'grade-set',
      position: value,
      field: 'active',
      value: !grade.active,
    });
  };

  const style = {
    color: grade.active ? 'white' : '#8F88BA',
    backgroundColor: grade.active ? grade.color : '#F2F0FF',
  };

  return (
    <div
      style={style}
      onClick={toggle}
      className="py-2 px-3 m-1 fw-bold rounded-1 d-flex justify-content-between gap-3"
    >
      <div className={grade.active ? '' : 'text-decoration-line-through'}>
        {grade.name}
      </div>
      <div>
        <FontAwesomeIcon
          onClick={handleActive}
          icon={grade.active ? faXmark : faRotateLeft}
        />
      </div>
    </div>
  );
};

export default GradeField;

import {useState} from 'react'
import {Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faPlus, faPen, faXmark, faCheck, faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import {useElection, useElectionDispatch} from './ElectionContext';

const GradeField = ({value}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(m => !m)

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
    })
  }

  const style = {
    color: grade.active ? "white" : "#8F88BA",
    backgroundColor: grade.active ? grade.color : "#F2F0FF",
  }

  return <Row
    style={style}
    onClick={toggle}
    className='p-2 m-1 rounded-1'
  >
    <Col className={`${grade.active ? "" : "text-decoration-line-through"} col-auto fw-bold`}>
      {grade.name}
    </Col>
    <Col onClick={handleActive} className='col-auto'>
      <FontAwesomeIcon icon={grade.active ? faXmark : faRotateLeft} />
    </Col>
  </Row >
}



export default GradeField;

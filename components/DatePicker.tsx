import {useState, forwardRef} from 'react'
import {Button, Row, Col} from 'reactstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DatePicker from 'react-datepicker'


const CustomDatePicker = ({icon, date, setDate}) => {
  return (<DatePicker
    selected={date}
    onChange={(date) => setDate(date)}
  />);
  //   const ExampleCustomInput = forwardRef(({value, onClick}, ref) => (
  //     <Button onClick={onClick} ref={ref}>
  //       <Row className='gx-2 align-items-end'>
  //         <Col className='col-auto'>
  //           <FontAwesomeIcon icon={icon} />
  //         </Col>
  //         <Col className='col-auto'>
  //           {children}
  //         </Col>
  //       </Row>
  //     </Button>
  //   ));
  //   {/*<Button className="example-custom-input" 
  //       {value}
  //     </button>*/}
  //   return (
  //     <DatePicker
  //       selected={startDate}
  //       onChange={(date) => setStartDate(date)}
  //       customInput={<ExampleCustomInput />}
  //     />
  //   );
};

export default CustomDatePicker;

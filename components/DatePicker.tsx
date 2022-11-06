import { useState, forwardRef, ReactNode } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import {
  faCalendarDays,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';

interface InputProps {
  children?: ReactNode;
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
export type ButtonRef = HTMLButtonElement;

const CustomDatePicker = ({ date, setDate }) => {
  const { t } = useTranslation();

  const ExampleCustomInput = forwardRef<ButtonRef, InputProps>(
    ({ value, onClick }, ref) => (
      <button onClick={onClick} ref={ref}>
        <Row className="p-2 align-items-end">
          <Col className="col-auto me-auto">
            <Row className="gx-3 align-items-end">
              <Col className="col-auto">
                <FontAwesomeIcon icon={faCalendarDays} />
              </Col>
              <Col className="col-auto">
                {t('admin.until')} {new Date(value).toDateString()}
              </Col>
            </Row>
          </Col>
          <Col className="col-auto">
            <FontAwesomeIcon className="text-muted" icon={faChevronDown} />
          </Col>
        </Row>
      </button>
    )
  );

  return (
    <DatePicker
      selected={date}
      customInput={<ExampleCustomInput value={null} onClick={null} />}
      onChange={(date) => setDate(date)}
    />
  );
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

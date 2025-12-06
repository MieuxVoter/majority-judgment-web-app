import { useState, forwardRef, ReactNode } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import {
  faCalendarDays,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import { AppTypes, useAppContext } from '@services/context';
import { useRouter } from 'next/router';
import { getFormattedDatetime } from '@services/utils';

interface InputProps {
  children?: ReactNode;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  prefix: string;
  isInvalid?: boolean;
}
export type ButtonRef = HTMLButtonElement;

const ExampleCustomInput = forwardRef<ButtonRef, InputProps & { locale: string }>(
  ({ value, onClick, prefix, isInvalid, locale }, ref) => (
    <div className="d-grid">
      <button type="button" onClick={onClick} ref={ref} className={isInvalid ? 'is-invalid' : ''}>
        <Row className="p-2 align-items-end">
          <Col className="col-auto me-auto">
            <Row className="gx-3 align-items-end">
              <Col className="col-auto">
                <FontAwesomeIcon icon={faCalendarDays} />
              </Col>
              <Col className="col-auto">
                {prefix}{' '}
                {value && getFormattedDatetime(locale, value)}
              </Col>
            </Row>
          </Col>
          <Col className="col-auto">
            <FontAwesomeIcon className="text-muted" icon={faChevronDown} />
          </Col>
        </Row>
      </button>
    </div>
  )
);

ExampleCustomInput.displayName = 'ExampleCustomInput';

const CustomDatePicker = ({ date, setDate, prefix, isInvalid = false, className = '', ...props }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [_, dispatchApp] = useAppContext();

  const handleChange = (date) => {
    setDate(date);
  };

  return (
    <DatePicker
      selected={date}
      className={className}
      customInput={<ExampleCustomInput prefix={prefix} isInvalid={isInvalid} locale={router.locale} />}
      onChange={handleChange}
      showTimeSelect
      dateFormat="Pp"
      timeFormat="HH:mm"
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

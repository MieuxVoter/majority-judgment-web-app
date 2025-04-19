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
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
export type ButtonRef = HTMLButtonElement;

const CustomDatePicker = ({ date, setDate, className = '', ...props }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [_, dispatchApp] = useAppContext();

  const handleChange = (date) => {
    const now = new Date();

    if (+date < +now) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.date-past'),
      });
    } else {
      setDate(date);
    }
  };

  const ExampleCustomInput = forwardRef<ButtonRef, InputProps>(
    ({ value, onClick }, ref) => (
      <div className="d-grid">
        <button onClick={onClick} ref={ref}>
          <Row className="p-2 align-items-end">
            <Col className="col-auto me-auto">
              <Row className="gx-3 align-items-end">
                <Col className="col-auto">
                  <FontAwesomeIcon icon={faCalendarDays} />
                </Col>
                <Col className="col-auto">
                  {t('admin.until')}{' '}
                  {getFormattedDatetime(router.locale, value)}
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

  return (
    <DatePicker
      selected={date}
      className={className}
      customInput={<ExampleCustomInput value={null} onClick={null} />}
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

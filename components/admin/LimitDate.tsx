import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';
import DatePicker from '@components/DatePicker';
import Switch from '@components/Switch';
import { ElectionTypes, useElection, isCreated } from '@services/ElectionContext';

const LimitDate = () => {
  const { t } = useTranslation();

  const [election, dispatch] = useElection();

  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15);
  const [endDate, setEndDate] = useState(
    election.dateEnd ? new Date(election.dateEnd) : defaultEndDate
  );
  const hasEndDate = election.dateEnd !== null;

  // Set a default start date 5 minutes in the future to avoid race condition
  const defaultStartDate = new Date();
  defaultStartDate.setMinutes(defaultStartDate.getMinutes() + 5);

  const [startDate, setStartDate] = useState(
    election.dateStart ? new Date(election.dateStart) : defaultStartDate
  );
  const hasStartDate = election.dateStart !== null;

  const toggleEndDate = () => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'dateEnd',
      value: hasEndDate ? null : endDate.toISOString(),
    });
  };

  const handleEndDate = (date) => {
    setEndDate(date);
    dispatch({
      type: ElectionTypes.SET,
      field: 'dateEnd',
      value: date ? date.toISOString() : null,
    });
  };

  const toggleStartDate = () => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'dateStart',
      value: hasStartDate ? null : startDate.toISOString(),
    });
  };

  const handleStartDate = (date) => {
    setStartDate(date);
    dispatch({
      type: ElectionTypes.SET,
      field: 'dateStart',
      value: date ? date.toISOString() : null,
    });
  };

  const desc = t('admin.limit-duration-desc');
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / oneDay);
  const isDateRangeInvalid = hasStartDate && hasEndDate && startDate.getTime() > endDate.getTime();
  const DATE_RANGE_ERROR_CODE = 'INVALID_DATE_RANGE';
  const isEndDateInPast = hasEndDate && endDate.getTime() < now.getTime();
  const DATE_PAST_ERROR_CODE = 'DATE_PAST';
  const isStartDateInPast = hasStartDate && !isCreated(election) && startDate.getTime() < now.getTime();

  // Update default dates with the ones from the election
  useEffect(() => {
    if (election.dateEnd) {
      setEndDate(new Date(election.dateEnd));
    }
    if (election.dateStart) {
      setStartDate(new Date(election.dateStart));
    }
  }, [election.dateEnd, election.dateStart]);

  // Perform validation and update context with errors
  useEffect(() => {
    if (isDateRangeInvalid) {
      dispatch({
        type: ElectionTypes.ADD_ERROR,
        value: DATE_RANGE_ERROR_CODE,
      });
    } else {
      dispatch({
        type: ElectionTypes.REMOVE_ERROR,
        value: DATE_RANGE_ERROR_CODE,
      });
    }
  }, [isDateRangeInvalid, dispatch]);

  useEffect(() => {
    if (isEndDateInPast && !isCreated(election)) {
      dispatch({
        type: ElectionTypes.ADD_ERROR,
        value: DATE_PAST_ERROR_CODE,
      });
    } else {
      dispatch({
        type: ElectionTypes.REMOVE_ERROR,
        value: DATE_PAST_ERROR_CODE,
      });
    }
  }, [isEndDateInPast, dispatch]);

  return (
    <>
      <Container className="bg-white p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto d-flex align-items-start justify-content-center">
            <h5 className="mb-0 text-dark gap-2 flex-column flex-md-row d-flex align-items-start">
              {t('admin.limit-start-date')}
            </h5>
          </div>
          <div className="col-auto d-flex align-items-center">
            <Switch toggle={toggleStartDate} state={hasStartDate} />
          </div>
        </div>
        {hasStartDate ? (
          <div className="mt-3">
            <DatePicker
              date={startDate}
              setDate={handleStartDate}
              prefix={t('admin.from')}
              isInvalid={isDateRangeInvalid}
            />
          </div>
        ) : null}
        {isStartDateInPast && (
          <div className="text-warning mt-2">{t('admin.start-date-past')}</div>
        )}
      </Container>

      <Container className="bg-white p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto d-flex align-items-start justify-content-center">
            <h5 className="mb-0 text-dark gap-2 flex-column flex-md-row d-flex align-items-start">
              {t('admin.limit-duration')}
              {hasEndDate ? (
                <>
                  {' '}
                  <div className="badge text-bg-light text-black-50">
                    {`${t('admin.ending-in')} ${remainingDays} ${t(
                      'common.days'
                    )}`}
                  </div>{' '}
                </>
              ) : null}
            </h5>
            {desc === '' ? null : <p className="text-muted">{desc}</p>}
          </div>
          <div className="col-auto d-flex align-items-center">
          <Switch toggle={toggleEndDate} state={hasEndDate} />
          </div>
        </div>
        {hasEndDate ? (
          <div className="mt-3">
            <DatePicker
              date={endDate}
              setDate={handleEndDate}
              prefix={t('admin.until')}
              isInvalid={isDateRangeInvalid || (isEndDateInPast && !isCreated(election))}
            />
          </div>
        ) : null}
        {isDateRangeInvalid ? (
          <div className="text-danger mt-2">
            {t('error.date-range-invalid')}
          </div>
        ) : isEndDateInPast ? (
          <div className={isCreated(election) ? "text-warning mt-2" : "text-danger mt-2"}>
            {t('error.date-past')}
          </div>
        ) : null}
      </Container>
    </>
  );
};

export default LimitDate;

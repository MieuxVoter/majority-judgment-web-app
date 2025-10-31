import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';
import DatePicker from '@components/DatePicker';
import Switch from '@components/Switch';
import { ElectionTypes, useElection } from '@services/ElectionContext';

const LimitDate = () => {
  const { t } = useTranslation();

  const [election, dispatch] = useElection();

  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15);
  const [endDate, setEndDate] = useState(
    election.dateEnd ? new Date(election.dateEnd) : defaultEndDate
  );
  const hasEndDate = election.dateEnd !== null;

  const [startDate, setStartDate] = useState(
    election.dateStart ? new Date(election.dateStart) : new Date()
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
      value: date.toISOString(),
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
      value: date.toISOString(),
    });
  };

  const desc = t('admin.limit-duration-desc');
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / oneDay);

  // Update default dates with the one from the election
  useEffect(() => {
    if (election.dateEnd !== null) {
      setEndDate(new Date(election.dateEnd));
    }
    if (election.dateStart !== null) {
      setStartDate(new Date(election.dateStart));
    }
  }, [election.dateEnd, election.dateStart]);

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
            <DatePicker date={startDate} setDate={handleStartDate} prefix={t('admin.from')} />
          </div>
        ) : null}
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
            <DatePicker date={endDate} setDate={handleEndDate} prefix={t('admin.until')} />
          </div>
        ) : null}
      </Container>
    </>
  );
};

export default LimitDate;

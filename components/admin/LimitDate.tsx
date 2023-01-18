import {useState} from 'react';
import {useTranslation} from 'next-i18next';
import {Container, Row, Col} from 'reactstrap';
import DatePicker from '@components/DatePicker';
import Switch from '@components/Switch';
import {ElectionTypes, useElection} from '@services/ElectionContext';

const LimitDate = () => {
  const {t} = useTranslation();
  const defaultEndDate = new Date();
  defaultEndDate.setUTCDate(defaultEndDate.getUTCDate() + 15);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const [election, dispatch] = useElection();
  const hasDate = election.dateEnd !== null;

  const toggle = () => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'dateEnd',
      value: hasDate ? null : endDate,
    });
  };

  const desc = t('admin.limit-duration-desc');
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / oneDay);

  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <div className="d-flex">
        <div className="me-auto d-flex align-items-start justify-content-center">
          <h5 className="mb-0 text-dark gap-2 flex-column flex-md-row d-flex align-items-start">
            {t('admin.limit-duration')}
            {hasDate ? (
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
          <Switch toggle={toggle} state={hasDate} />
        </div>
      </div>
      {hasDate ? (
        <div className="mt-3">
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
      ) : null}
    </Container>
  );
};

export default LimitDate;

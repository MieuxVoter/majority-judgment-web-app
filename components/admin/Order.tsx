/**
 * A field to set the order of candidates in the ballot vote.
 */
import { useTranslation } from 'next-i18next';
import { Container } from 'reactstrap';
import Switch from '@components/Switch';
import { ElectionTypes, useElection } from '@services/ElectionContext';

const Order = () => {
  const { t } = useTranslation();

  const [election, dispatch] = useElection();

  const toggle = () => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'randomOrder',
      value: !election.randomOrder,
    });
  };

  return (
    <>
      <Container className="bg-white  p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto d-flex flex-column justify-content-center">
            <h5 className="mb-0 text-dark d-flex align-items-center">
              {t('admin.order-title')}
            </h5>
            <p className="text-muted d-none d-md-block">
              {t('admin.order-desc')}
            </p>
          </div>
          <Switch toggle={toggle} state={election.randomOrder} />
        </div>
      </Container>
    </>
  );
};

export default Order;

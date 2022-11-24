/**
 * A field to set the order of candidates in the ballot vote.
 */
import {useTranslation} from 'next-i18next';
import {Container} from 'reactstrap';
import Switch from '@components/Switch';
import {useElection, useElectionDispatch} from '@services/ElectionContext';

const Order = () => {
  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();

  const toggle = () => {
    dispatch({
      type: 'set',
      field: 'randomOrder',
      value: !election.randomOrder,
    });
  };
  console.log(election.randomOrder)

  return (
    <>
      <Container className="bg-white  p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto">
            <h4 className="mb-0 text-dark">
              {t('admin.order-title')}
            </h4>
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

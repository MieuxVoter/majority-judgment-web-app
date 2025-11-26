import {useTranslation} from 'next-i18next';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import {Container} from 'reactstrap';
import Switch from '@components/Switch';

const AccessResults = () => {
  const {t} = useTranslation();
  const [election, dispatch] = useElection();

  const toggle = () => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'authForResult',
      value: !election.authForResult,
    });
  };

  return (
    <Container className="bg-white p-3 p-md-4 mt-1">
      <div className="d-flex gap-3">
        <div className="me-auto d-flex flex-column justify-content-center">
          <h5 className="mb-0 text-dark d-flex align-items-center">
            {t('admin.access-results-only-admin')}
          </h5>
          {election.authForResult ? (
            <>
              <p className="text-muted">
                {t('admin.access-results-only-admin-desc')}
              </p>
              <div className="text-warning mt-2">
                {t('admin.admin-only-results-warning')}
              </div>
            </>
          ) : null}
        </div>
        <Switch toggle={toggle} state={election.authForResult} />
      </div>
    </Container>
    
  );
};

export default AccessResults;

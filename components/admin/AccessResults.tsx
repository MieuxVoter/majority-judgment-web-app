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
      field: 'restrictResult',
      value: !election.hideResults,
    });
  };

  return (
    <>
      <Container className="bg-white p-3 p-md-4">
        <div className="d-flex">
          <div className="me-auto">
            <h4 className="text-dark mb-0">{t('admin.access-results')}</h4>
            <p className="text-muted d-none d-md-block">
              {t('admin.access-results-desc')}
            </p>
          </div>
          <Switch toggle={toggle} state={election.hideResults} />
        </div>
      </Container>
      {election.hideResults ? (
        <Container className="text-white d-md-none p-3">
          {t('admin.access-results-desc')}
        </Container>
      ) : null}
    </>
  );
};

export default AccessResults;

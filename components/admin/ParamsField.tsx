import { useTranslation } from 'next-i18next';
import { Container } from 'reactstrap';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';
import Grades from './Grades';
import LimitDate from './LimitDate';
import AccessResults from './AccessResults';
import Order from './Order';
import Private from './Private';
import { useElection, getTotalInvites } from '@services/ElectionContext';
import ResultForAdminOnlyParam from './ResultForAdminOnlyParam';

const ParamsField = ({ onSubmit }) => {
  const { t } = useTranslation();

  const [election, _] = useElection();
  const checkDisability = (election.restricted && getTotalInvites(election) === 0) ||
     election.grades.filter((g) => g.active).length < 2;

  return (
    <Container className="params d-flex flex-column flex-grow-1 my-5">
      <Container className="px-0 d-md-none mb-5">
        <div className="w-100 d-grid d-md-none mb-4">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            onClick={onSubmit}
            icon={faArrowLeft}
            position="left"
          >
            {t('admin.candidates-back-step')}
          </Button>
        </div>
        <h4>{t('admin.params-title')}</h4>
      </Container>
      <div className="d-flex flex-grow-1 flex-column justify-content-between">
        <div className="d-flex flex-column">
          <AccessResults />
          <ResultForAdminOnlyParam/>
          <LimitDate />
          <Grades />
          <Order />
          <Private />
        </div>
        <Container className="my-5 d-none d-md-flex justify-content-md-center">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            onClick={onSubmit}
            disabled={checkDisability}
            icon={faArrowRight}
            position="right"
          >
            {t('admin.params-submit')}
          </Button>
        </Container>
        <Container className="my-5 d-grid justify-content-md-center d-md-none">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            onClick={onSubmit}
            disabled={checkDisability}
            icon={faArrowRight}
            position="right"
          >
            {t('admin.params-submit')}
          </Button>
        </Container>
      </div>
    </Container>
  );
};

export default ParamsField;

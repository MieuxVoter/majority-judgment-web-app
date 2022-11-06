import { useTranslation } from 'next-i18next';
import { Container } from 'reactstrap';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';
import Grades from './Grades';
import LimitDate from './LimitDate';
import AccessResults from './AccessResults';
import Private from './Private';

const ParamsField = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <Container className="params d-flex flex-column flex-grow-1 my-5">
      <Container className="px-0 d-md-none mb-5">
        <h4>{t('admin.params-title')}</h4>
      </Container>
      <div className="d-flex flex-grow-1 flex-column justify-content-between">
        <div className="d-flex flex-column">
          <AccessResults />
          <LimitDate />
          <Grades />
          <Private />
        </div>
        <Container className="my-5 d-md-flex d-grid justify-content-md-center">
          <Button
            outline={true}
            color="secondary"
            className="bg-blue"
            onClick={onSubmit}
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

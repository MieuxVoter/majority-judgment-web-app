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
    <Container className="params flex-grow-1 my-5 mt-5 flex-column d-flex justify-content-between">
      <div className="d-flex flex-column">
        <AccessResults />
        <LimitDate />
        <Grades />
        <Private />
      </div>
      <div className="my-4 d-flex justify-content-center">
        <Button
          outline={true}
          color="secondary"
          onClick={onSubmit}
          icon={faArrowRight}
          position="right"
        >
          {t('admin.params-submit')}
        </Button>
      </div>
    </Container>
  );
};

export default ParamsField;

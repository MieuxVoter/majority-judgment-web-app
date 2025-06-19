import { Container } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { CONTACT_MAIL } from '@services/constants';
import Button from '@components/Button';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Error = ({ displayErrorTitle = true, children }) => {
  const { t } = useTranslation();
  if (!children) return null;

  return (
    <div className="flex-fill d-flex align-items-center bg-secondary pt-3 pb-5">
      <Container style={{ maxWidth: '700px' }} className="mb-5 ">
        { displayErrorTitle && 
          <h4>{t('common.error')}</h4>
        }
        <p>{children}</p>

        <a
          href={`mailto:${CONTACT_MAIL}?subject=[HELP]`}
          className="d-md-flex d-grid"
        >
          <Button
            color="secondary"
            outline={true}
            className="text-white"
            icon={faEnvelope}
          >
            {t('error.help')}
          </Button>
        </a>
      </Container>
    </div>
  );
};

export default Error;

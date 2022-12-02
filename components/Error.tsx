import {Container} from 'reactstrap';
import {useTranslation} from 'next-i18next';
import {CONTACT_MAIL} from '@services/constants';
import Button from '@components/Button'
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';

const Error = ({msg}) => {
  const {t} = useTranslation();
  if (!msg) return null;

  return (
    <Container className="full-height-container">
      <h4>{t("common.error")}</h4>
      <div className="text-black text-center shadow-lg border-dark border border-2 p-3 my-3 bg-white">{msg}</div>

      <a
        href={`mailto:${CONTACT_MAIL}?subject=[HELP]`}
        className="d-grid"
      >
        <Button
          color="secondary"
          outline={true}
          className="text-white"
          icon={faEnvelope}>
          {t('error.help')}
        </Button>
      </a >
    </Container >
  );
};

export default Error;

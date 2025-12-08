import { UncontrolledAlert } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { CONTACT_MAIL } from '@services/constants';

const AlertDismissible = ({ msg, color = 'danger' }) => {
  const { t } = useTranslation();

  if (msg) {
    return (
      <UncontrolledAlert color={color}>
        <h4 className={`${color}-heading`}>{t(msg)}</h4>
        <p>
          <a
            href={`mailto:${CONTACT_MAIL}?subject=[HELP]`}
            className="btn btn-success m-auto"
          >
            {t('error.help')}
          </a>
        </p>
      </UncontrolledAlert>
    );
  }
  return null;
};

export default AlertDismissible;

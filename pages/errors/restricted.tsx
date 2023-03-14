import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Container} from 'reactstrap';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';
import {CONTACT_MAIL} from '@services/constants';


export async function getServerSideProps({locale}) {
  const translations = await serverSideTranslations(locale, ['resource'])

  return {
    props: {
      ...translations,
    },
  };
}

const RestrictedVote = () => {
  const {t} = useTranslation();

  return (
    <div className="flex-fill d-flex align-items-center bg-secondary pt-3 pb-5">
      <Container style={{maxWidth: '700px'}} className="mb-5 ">
        <h4>{t('error.restricted-election-title')}</h4>
        <p>{t('error.restricted-election-desc')}</p>

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


export default RestrictedVote;


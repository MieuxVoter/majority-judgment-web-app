import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {Container} from 'reactstrap';
import ErrorMessage from '@components/Error';
import {getUrl, RouteTypes} from '@services/routes';
import Blur from '@components/Blur';
import Button from '@components/Button';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';

export const getServerSideProps = async ({query: {pid, tid}, locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['resource'])),
      token: tid ? tid : "",
      electionRef: pid.replaceAll('-', ''),
    },
  };
};

const End = ({electionRef, token}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <>
      <Blur />
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <ErrorMessage>{t('error.ended-election')}</ErrorMessage>
        <Container className="full-height-container">
          <Link
            className="d-grid w-100 mt-5"
            href={getUrl(RouteTypes.RESULTS, locale, electionRef, token)}
          >
            <Button
              color="secondary"
              outline={true}
              type="submit"
              icon={faArrowRight}
              position="right"
            >
              {t('vote.go-to-results')}
            </Button>
          </Link>
        </Container>
      </div>
    </>
  );
};

export default End;

import Link from 'next/link';
import { Container } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <Container className="text-center my-5">
      <h1 className="display-4">{t('error.page_not_found') || '404 - Page Not Found'}</h1>
      <p className="lead">
        <Link href="/">
          {t('return_home') || 'Return to Home'}
        </Link>
      </p>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      // This is the critical part: Load translations for the Header/Footer
      ...(await serverSideTranslations(locale ?? 'fr', ['resource'])),
    },
  };
};

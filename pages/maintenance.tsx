import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Container } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useAppContext, AppTypes } from '@services/context';

export default function Maintenance() {
  const { t } = useTranslation();
  const [, dispatch] = useAppContext();

  // Masque le Header et le Footer pour une page autonome.
  useEffect(() => {
    dispatch({ type: AppTypes.FULLPAGE, value: true });
    return () => dispatch({ type: AppTypes.FULLPAGE, value: false });
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>{t('maintenance.title') || 'Maintenance en cours'}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="bg-light text-dark flex-grow-1 d-flex align-items-center">
        <Container className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
          <Image
            src="/logos/logo-color.svg"
            alt="Mieux Voter"
            width={160}
            height={160}
            priority
          />
          <h1 className="display-5 mt-5">
            {t('maintenance.title') || 'Maintenance en cours'}
          </h1>
          <p className="lead mt-3">
            {t('maintenance.description') ||
              'Le site est temporairement indisponible pour maintenance. Merci de revenir un peu plus tard.'}
          </p>
        </Container>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['resource'])),
    },
  };
};

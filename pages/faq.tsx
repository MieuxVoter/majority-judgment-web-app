import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Logo from '@components/Logo';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const FAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="min-vw-100 min-vh-100 bg-secondary py-4">
      <Container className="">
        <Logo />
        <div className="mt-4 text-center">
          <h1>{t('faq.title')}</h1>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <video width="640" height="480" controls={true}>
            <source
              src="/video/Le_Jugement_Majoritaire_en_1_minute.mp4"
              type="video/mp4"
            />
            <source
              src="/video/Le_Jugement_Majoritaire_en_1_minute.webm"
              type="video/webm"
            />
            <source
              src="/video/Le_Jugement_Majoritaire_en_1_minute.3gpp"
              type="video/3gpp"
            />
          </video>
        </div>
        {[...Array(19)].map((_, i) => (
          <>
            <h4 className="bold mt-5">{t(`faq.sec-${i + 1}-title`)}</h4>
            <p>{t(`faq.sec-${i + 1}-desc`)}</p>
          </>
        ))}
      </Container>
    </div>
  );
};

export default FAQ;

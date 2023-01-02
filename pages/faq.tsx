import { Container } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Button from '@components/Button';
import { PAYPAL } from '@services/constants';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const FAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="min-vw-100 min-vh-100 bg-secondary pt-3 pb-5">
      <Container style={{ maxWidth: '700px' }} className="mb-5">
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
        <div className="mt-5 text-center">
          <h1>{t('faq.title')}</h1>
        </div>
        {[...Array(18)].map((_, i) => (
          <>
            <h4 className="bold mt-5">{t(`faq.sec-${i + 1}-title`)}</h4>
            <p>{t(`faq.sec-${i + 1}-desc`)}</p>
          </>
        ))}

        <div className="w-100 d-flex justify-content-center">
          <a href={PAYPAL}>
            <Button outline={false} color="primary">
              {t('common.support-us')}
            </Button>
          </a>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;

import { MAJORITY_JUDGMENT_LINK } from '@services/constants';
import Image from 'next/image';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import { Row, Col, Container } from 'reactstrap';
import Button from '@components/Button';
import vote from '../public/vote.svg';

const Experiencediv = () => {
  const { t } = useTranslation('resource');
  return (
    <div className="sectionTwodivTwo mt-4">
      <div className="w-100 justify-content-center d-flex">
        <Image
          className="d-block d-md-none"
          src={vote}
          alt={t('home.alt-icon-ballot')}
        />
      </div>

      <h3>{t('home.experience-name')}</h3>
      <Container className="my-5">
        <Row className="sectionTwodivTwodiv mb-5">
          <Col className="sectionTwodivTwodivText col-12 col-md-4">
            <h5 className="">{t('home.experience-1-name')}</h5>
            <p>{t('home.experience-1-desc')}</p>
          </Col>
          <Col className="sectionTwodivTwodivText col-12 col-md-4 offset-md-1">
            <h5 className="">{t('home.experience-2-name')}</h5>
            <p>{t('home.experience-2-desc')}</p>
            <p></p>
          </Col>
        </Row>
      </Container>
      <div className="d-flex w-100 justify-content-center mt-5">
        <a
          href={MAJORITY_JUDGMENT_LINK}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Button
            color="primary py-3"
            outline={false}
            type="submit"
            icon={faArrowRight}
            position="right"
          >
            {t('home.experience-call-to-action')}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Experiencediv;

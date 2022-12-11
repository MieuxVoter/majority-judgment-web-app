import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Row, Col, Button, Container } from 'reactstrap';
import arrowRight from '../public/arrow-white.svg';
import vote from '../public/vote.svg';

const Experiencediv = () => {
  const { t } = useTranslation('resource');
  return (
    <div className="sectionTwodivTwo">
      <div className="w-100 justify-content-center d-flex">
        <Image
          className="d-block d-md-none"
          src={vote}
          alt={t('home.alt-icon-ballot')}
        />
      </div>

      <div className="d-md-block d-none vote_background"></div>
      <h3 className="mb-5">{t('home.experience-name')}</h3>
      <Container>
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
        <Button color="primary" className="p-4 fs-5">
          {t('home.experience-call-to-action')}
          <Image
            src={arrowRight}
            width={22}
            height={22}
            alt="icon arrow right"
          />
        </Button>
      </div>
    </div>
  );
};

export default Experiencediv;

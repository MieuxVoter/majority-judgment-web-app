import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import {Row, Col, Button} from 'reactstrap';
import arrowRight from '../public/arrow-white.svg';
import vote from '../public/vote.svg';


const ExperienceRow = () => {
  const {t} = useTranslation('resource');
  return (
    <Row className="sectionTwoRowTwo">
      <Row className="sectionTwoHomeImage">
        <Image src={vote} alt={t('home.alt-icon-ballot')} />
      </Row>
      <Row className="sectionTwoRowTwoCol">
        <h3 className="col-md-8">{t('home.experience-name')}</h3>
      </Row>
      <Row className="sectionTwoRowTwoCol">
        <Col className="sectionTwoRowTwoColText col-md-4">
          <h5 className="">{t('home.experience-1-name')}</h5>
          <p>{t('home.experience-1-desc')}</p>
        </Col>
        <Col className="sectionTwoRowTwoColText col-md-4 offset-md-1">
          <h5 className="">{t('home.experience-2-name')}</h5>
          <p>{t('home.experience-2-desc')}</p>
          <p></p>
        </Col>
      </Row>
      <Row className="sectionTwoRowThreeCol mt-5">
        <Col>
          <Button color="primary" className="p-4 fs-5">
            {t('home.experience-call-to-action')}
            <Image
              src={arrowRight}
              width={22}
              height={22}
              alt="icon arrow right"
            />
          </Button>
        </Col>
      </Row>
    </Row>
  );
};


export default ExperienceRow

import {MAJORITY_JUDGMENT_LINK} from '@services/constants';
import Image from 'next/image';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import {Row, Col, Container} from 'reactstrap';
import Button from '@components/Button';
import vote from '../public/vote.svg';

const Experiencediv = () => {
  const {t} = useTranslation('resource');
  return (
    <div className="pt-5">
      <div
        className="w-100 justify-content-end d-flex d-md-none"
        style={{marginTop: '-200px'}}
      >
        <Image src={vote} alt={t('home.alt-icon-ballot')} />
      </div>

      <Container>
        <h3 className="text-center">{t('home.experience-name')}</h3>
      </Container>
      <div className="d-flex">
        <Container style={{maxWidth: "800px"}}>
          <Row className="ps-5 my-5 flex-fill justify-content-end align-items-start gx-md-5 d-flex">
            <Col className="col-12 col-md-6">
              <h5 className="">{t('home.experience-1-name')}</h5>
              <p>{t('home.experience-1-desc')}</p>
            </Col>
            <Col className="col-12  col-md-6">
              <h5 className="">{t('home.experience-2-name')}</h5>
              <p>{t('home.experience-2-desc')}</p>
              <p></p>
            </Col>
          </Row>
        </Container>
        <Image
          className="d-none d-md-flex justify-content-end"
          src={vote}
          alt={t('home.alt-icon-ballot')}
        />
      </div>
      <Container className="d-flex w-100 justify-content-center mt-5">
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
      </Container>
    </div>
  );
};

export default Experiencediv;

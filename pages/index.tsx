import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Container, Row, Col, Button, Input} from 'reactstrap';
import Logo from '@components/Logo';
import Share from '@components/Share';
import AdvantagesRow from '@components/Advantages'
import ExperienceRow from '@components/Experience'
import {CREATE_ELECTION} from '@services/routes';
import arrowRight from '../public/arrow-white.svg';

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const StartForm = () => {
  const {t} = useTranslation('resource');
  const [name, setName] = useState(null);

  return (
    <form className="sectionOneHomeForm" autoComplete="off">
      <Row className="sectionOneHomeRowOne">
        <Col className="sectionOneHomeContent">
          <Logo height="128" />
          <Row>
            <h4>{t('home.motto')}</h4>
          </Row>
          <Row>
            <h2>{t('home.slogan')}</h2>
          </Row>
          <Row className="justify-content-end">
            <Input
              placeholder={t('home.writeQuestion')}
              autoFocus
              required
              className="mt-2 mb-0 sectionOneHomeInput"
              name="name"
              value={name ? name : ''}
              onChange={(e) => setName(e.target.value)}
            />

            <p className="pt-0 mt-0 maxLength">250</p>
          </Row>
          <Row>
            <Link href={{pathname: CREATE_ELECTION, query: {name: name}}}>
              <Button color="secondary" outline={true} type="submit">
                <Row className="justify-content-md-center  p-2">
                  <Col className="col-auto">{t('home.start')}</Col>
                  <Col className="col-auto d-flex">
                    <Image
                      src={arrowRight}
                      width={22}
                      height={22}
                      alt={t('home.start')}
                      className="align-self-center"
                    />
                  </Col>
                </Row>
              </Button>
            </Link>
          </Row>
          <Row className="noAds">
            <p>{t('home.noAds')}</p>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </form>
  );
};


const Home = () => {
  const {t} = useTranslation('resource');
  return (
    <Container fluid={true} className="p-0">
      <section>
        <StartForm />
      </section>
      <section className="sectionTwoHome">
        <AdvantagesRow />
        <ExperienceRow />
        <Share />
      </section>
    </Container>
  );
};

export default Home;

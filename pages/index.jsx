import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {Container, Row, Col, Button, Input} from "reactstrap";
import Logo from '@components/Logo.jsx';
import {CREATE_ELECTION} from '@services/routes';
import ballotBox from '../public/urne.svg'
import email from '../public/email.svg'
import respect from '../public/respect.svg'
import vote from '../public/vote.svg'
import twitter from '../public/twitter.svg'
import facebook from '../public/facebook.svg'
import arrowRight from '../public/arrow-white.svg'


export const getStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});


const StartForm = () => {
  const {t} = useTranslation('resource');
  const [title, setTitle] = useState(null);

  return (
    <form className="sectionOneHomeForm" autoComplete="off">
      <Row className="sectionOneHomeRowOne">
        <Col className="sectionOneHomeContent">
          <Row>
            <Logo height="128" />
          </Row>
          <Row>
            <h4>{t("home.motto")}</h4>
          </Row>
          <Row>
            <h2>{t("home.slogan")}</h2>
          </Row>
          <Row className="justify-content-end">
            <Input
              placeholder={t("home.writeQuestion")}
              autoFocus
              required
              className="mt-2 mb-0 sectionOneHomeInput"
              name="title"
              value={title ? title : ""}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="250"
            />

            <p className="pt-0 mt-0 mr-0 maxLength">250</p>

          </Row>
          <Row>
            <Link href={{pathname: CREATE_ELECTION, query: {title: title}}}>
              <Button type="submit">
                <Row className="justify-content-md-center  p-2">
                  <Col className='col-auto'>
                    {t("home.start")}
                  </Col>
                  <Col className='col-auto d-flex'>
                    <Image
                      src={arrowRight}
                      width={22}
                      height={22}
                      alt={t("home.start")}
                      className="align-self-center"
                    />
                  </Col>
                </Row>
              </Button>
            </Link>
          </Row>
          <Row className="noAds">
            <p>{t("home.noAds")}</p>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </form>
  );

}


const AdvantagesRow = () => {
  const {t} = useTranslation('resource');
  const resources = [
    {
      "src": ballotBox,
      "alt": t("home.alt-icon-ballot-box"),
      "title": t('home.advantage-1-title'),
      "desc": t('home.advantage-1-desc'),
    },
    {
      "src": email,
      "alt": t("home.alt-icon-envelop"),
      "title": t('home.advantage-2-title'),
      "desc": t('home.advantage-2-desc'),
    },
    {
      "src": respect,
      "alt": t("home.alt-icon-respect"),
      "title": t('home.advantage-3-title'),
      "desc": t('home.advantage-3-desc'),
    }
  ]
  return (<Row className="sectionTwoRowOne">
    {resources.map((item, i) =>
      <Col key={i} className="sectionTwoRowOneCol">
        <Image
          src={item.src}
          alt={item.alt}
          height="128"
          className="d-block mx-auto"
        />
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
      </Col>
    )
    }
  </Row >
  )
}


const ExperienceRow = () => {
  const {t} = useTranslation('resource');
  return (
    <Row className="sectionTwoRowTwo">
      <Row className="sectionTwoHomeImage">
        <Image src={vote} alt={t('home.alt-icon-ballot')} />
      </Row>
      <Row className="sectionTwoRowTwoCol">
        <h3 className="col-md-8">{t('home.experience-title')}</h3>
      </Row>
      <Row className="sectionTwoRowTwoCol">
        <Col className="sectionTwoRowTwoColText col-md-4">
          <h5 className="">{t('home.experience-1-title')}</h5>
          <p>{t('home.experience-1-desc')}</p>
        </Col>
        <Col className="sectionTwoRowTwoColText col-md-4 offset-md-1">
          <h5 className="">{t('home.experience-2-title')}</h5>
          <p>{t('home.experience-2-desc')}</p>
          <p></p>
        </Col>
      </Row>
      <Row className="sectionTwoRowThreeCol mt-5">
        <Col>
          <Button
            color="primary"
          >
            {t('home.experience-call-to-action')}
            <Image src={arrowRight} width={22} height={22} className="mr-2" />
          </Button>
        </Col>
      </Row>
    </Row>
  )
};


const ShareRow = () => {
  const {t} = useTranslation('resource');
  return (
    <Row className="sharing justify-content-md-center">
      <Col className="col-auto">
        {t('home.share')}
      </Col>
      <Col className="col-auto">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/mieuxvoter.fr/">
          <Image height={22} width={22}
            src={facebook} />
        </a>
      </Col>
      <Col className="col-auto">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/mieux_voter">
          <Image height={22} width={22}
            src={twitter} />
        </a>
      </Col>
    </Row>
  )
}

const Home = () => {
  const {t} = useTranslation('resource');
  return (
    <Container fluid={true} className='p-0'>
      <section><StartForm /></section>
      <section className="sectionTwoHome">
        <AdvantagesRow />
        <ExperienceRow />
        <ShareRow />
      </section>
    </Container >

  );
};

export default Home;

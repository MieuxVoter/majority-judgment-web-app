import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Container, Row, Col, Input} from 'reactstrap';
import Logo from '@components/Logo';
import Share from '@components/Share';
import AdvantagesRow from '@components/Advantages';
import ExperienceRow from '@components/Experience';
import Button from '@components/Button';
import {getUrl, RouteTypes} from '@services/routes';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';
import Papa from 'papaparse';

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const StartForm = () => {
  const {t} = useTranslation('resource');
  const [name, setName] = useState(null);
  const router = useRouter();
  const locale = getLocaleShort(router);

  return (
    <>
      <form className="sectionOneHomeForm d-none d-md-block" autoComplete="off">
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
              <Link
                href={{
                  pathname: getUrl(
                    RouteTypes.CREATE_ELECTION,
                    locale
                  ).toString(),
                  query: {name: name},
                }}
              >
                <Button
                  color="secondary"
                  outline={true}
                  type="submit"
                  icon={faArrowRight}
                  position="right"
                >
                  {t('home.start')}
                </Button>
              </Link>
            </Row>
            <Row>
              {/*<Link
                href={{
                  pathname: getUrl(
                    RouteTypes.UPLOAD_CSV,
                    locale
                  ).toString(),
                  query: {name: name},
                }}
              >*/}
                <Button
                  color="secondary"
                  outline={true}
                  type="submit"
                  icon={faArrowRight}
                  position="right"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = Papa.parse(e.target.result);
                          console.log(result);

                          if (result.data) {
                            const mentions = result.data[0].slice(1);
                            const candidatsAndResults = result.data.slice(1);

                            router.push({
                              pathname: '/result',
                              query: {
                                mentions: JSON.stringify(mentions),
                                candidatsAndResults: JSON.stringify(candidatsAndResults),
                                fromCSV:true
                              }
                            });
                          }
                        };
                        reader.readAsText(file);
                        // Handle the file upload
                      }
                    };
                    input.click();
                  }}
                >
                  {t('home.uploadCSV')}
                </Button>
              {/*</Link>*/}
            </Row>
            <Row className="noAds">
              <p>{t('home.noAds')}</p>
            </Row>
          </Col>
          <Col></Col>
        </Row>
      </form>

      {/**
       * Mobile
       */}
      <div className="d-block d-md-none py-5 px-3 min-vh-100 d-flex d-md-none flex-column align-items-center justify-content-between">
        <Logo width={164} />
        <h4>{t('home.motto')}</h4>
        <h2 className="d-none d-md-block">{t('home.slogan')}</h2>
        <h2
          className="d-block  d-mg-none text-center"
          style={{fontSize: '32px'}}
        >
          {t('home.slogan')}
        </h2>
        <div className="d-block w-100">
          <Input
            placeholder={t('home.writeQuestion')}
            autoFocus
            required
            className="mt-2 mb-0 sectionOneHomeInput"
            name="name"
            value={name ? name : ''}
            onChange={(e) => setName(e.target.value)}
          />

          <p className="pt-0 mt-0 text-end text-muted">250</p>
        </div>
        <form autoComplete="off" className="w-100">
          <Link
            className="d-grid w-100"
            href={{
              pathname: getUrl(RouteTypes.CREATE_ELECTION, locale).toString(),
              query: {name: name},
            }}
          >
            <Button
              color="secondary py-3"
              outline={true}
              type="submit"
              icon={faArrowRight}
              position="right"
            >
              {t('home.start')}
            </Button>
          </Link>
        </form>
        <div className="noAds mt-4">{t('home.noAds')}</div>
      </div>
    </>
  );
};

const Home = () => {
  const {t} = useTranslation('resource');
  return (
    <>
      <div className="bg-primary">
        <StartForm />
      </div>
      <section className="sectionTwoHome  pb-5 text-center">
        <div className=" pt-5 mt-5">
          <AdvantagesRow />
        </div>
        <ExperienceRow />
        <Share />
      </section>
    </>
  );
};

export default Home;

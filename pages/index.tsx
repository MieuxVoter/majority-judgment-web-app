import {useState} from 'react';
import Link from 'next/link';
import {GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {Row, Col, Input} from 'reactstrap';
import Logo from '@components/Logo';
import Share from '@components/Share';
import AdvantagesRow from '@components/Advantages';
import ExperienceRow from '@components/Experience';
import Button from '@components/Button';
import {getUrl, RouteTypes} from '@services/routes';
import {faArrowRight, faQuestion} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';
import Papa from 'papaparse';
import IconButton from '@components/IconButton';
import CSVModal from '@components/CSVModal';
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

  const [showCSVModal, setShowCSVModal] = useState(false);
  const invertShowCSVModal = ()=>{
    setShowCSVModal(!showCSVModal);
  };

  return (
    <>
      <CSVModal show={showCSVModal} onClose={invertShowCSVModal}/>
      <div className="sectionOneHomeForm d-none d-md-block">
        <Row className="sectionOneHomeRowOne">
          <Col className="sectionOneHomeContent">
            <div className="content-container">
              <Logo height="128" />
              <Row>
                <h4>{t('home.motto')}</h4>
              </Row>
              <Row>
                <h2>{t('home.slogan')}</h2>
              </Row>
              <form autoComplete="off">
                <Row className="justify-content-end g-0">
                  <Input
                    placeholder={t('home.writeQuestion')}
                    autoFocus
                    required
                    className="mt-2 mb-0 sectionOneHomeInput"
                    name="name"
                    value={name ? name : ''}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={250}
                  />

                  <p className="pt-0 mt-0 maxLength">{name ? name.length : 0} / 250</p>
                </Row>
                <Row className="mb-4 g-0">
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
                      // Added styles to force wrapping and limit width
                      className="buttonWrapStyle"
                      icon={faArrowRight}
                      position="right"
                    >
                      {t('home.start')}
                    </Button>
                  </Link>
                </Row>
              </form>
              <Row className='align-items-center gap-2 flex-nowrap g-0'>
                <Button
                  color="secondary"
                  outline={true}
                  type="submit"
                  className="buttonWrapStyle"
                  style={{
                    width: 'fit-content',
                    maxWidth: 'calc(100% - 68px)' // Leave 68px for the "?" button
                  }}
                  icon={faArrowRight}
                  position="right"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files[0];

                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const target = e.target as FileReader;
                          if (target.result) {

                            try {
                              const result = Papa.parse(target.result as string);

                              if (result.data) {
                                if (Array.isArray(result.data[0])) {
                                  const mentions = result.data[0].slice(1);
                                  const candidatsAndResults = result.data.slice(1);

                                  router.push({
                                    pathname: '/result',
                                    query: {
                                      mentions: JSON.stringify(mentions),
                                      candidatsAndResults: JSON.stringify(candidatsAndResults),
                                      fromCSV: true
                                    }
                                  });
                                } else
                                  throw "invalid csv";
                              }
                            } catch(e) {
                              console.error(e);
                              alert("Invalid csv");
                            }
                          }
                        };

                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                >
                  {t('home.uploadCSV')}
                </Button>
                <IconButton
                  color="secondary"
                  outline={true}
                  type="submit"
                  icon={faQuestion}
                  position="right"
                  className="iconButtonStyle"
                  onClick={invertShowCSVModal}
                />
              </Row>
              <Row className="noAds">
                <p>{t('home.noAds')}</p>
              </Row>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </div>

      {/**
       * Mobile
       */}
      <div className="d-block d-md-none py-5 px-3 min-vh-100 d-flex d-md-none flex-column align-items-center justify-content-between mobile-content-container">
        <Logo width={164} />
        <h4>{t('home.motto')}</h4>
        <h2 className="d-none d-md-block">{t('home.slogan')}</h2>
        <h2
          className="mobileSloganStyle d-block  d-mg-none text-center"
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
            maxLength={250}
          />

          <p className="pt-0 mt-0 text-end text-muted">{name ? name.length : 0} / 250</p>
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

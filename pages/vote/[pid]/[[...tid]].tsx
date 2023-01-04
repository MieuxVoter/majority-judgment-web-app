import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Col, Container, Row } from 'reactstrap';
import Link from 'next/link';
import Share from '@components/Share';
import Button from '@components/Button';
import ExperienceRow from '@components/Experience';
import AdvantagesRow from '@components/Advantages';
import Logo from '@components/Logo';
import { getUrl, RouteTypes } from '@services/routes';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { displayRef, getLocaleShort } from '@services/utils';
import { MAJORITY_JUDGMENT_LINK } from '@services/constants';

export async function getServerSideProps({ query: { pid, tid }, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['resource'])),
      electionRef: pid.replaceAll('-', ''),
      token: tid || null,
    },
  };
}

interface VoteInterface {
  electionRef: string;
  token?: string;
}

const GoToBallotConfirmDesktop = ({ electionRef, token }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="sectionOneHomeForm d-none d-md-block">
      <Row className="sectionOneHomeRowOne">
        <Col className="sectionOneHomeContent">
          <Logo height="128" />
          <Row>
            <h2 className="mb-4 mt-5">{t('common.welcome')}</h2>
          </Row>
          <Row>
            <h4 className="mb-5">{t('vote.home-desc')}</h4>
          </Row>

          <div className="w-100">
            <Link
              className="d-grid d-md-block w-100"
              href={getUrl(RouteTypes.BALLOT, router, electionRef, token)}
            >
              <Button
                color="secondary"
                outline={true}
                type="submit"
                icon={faArrowRight}
                position="right"
              >
                {t('vote.home-start')}
              </Button>
            </Link>
          </div>
          <Row className="noAds my-0">
            <p>{t('home.noAds')}</p>
          </Row>
          <Row>
            <Link href={MAJORITY_JUDGMENT_LINK}>
              <Button color="black" outline={true} className="mt-2 mb-5">
                {t('common.about-mj')}
              </Button>
            </Link>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
const GoToBallotConfirmMobile = ({ electionRef, token }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="d-block d-md-none bg-primary py-5 px-3 min-vh-100 d-flex d-md-none flex-column align-items-center justify-content-between">
      <Col className="sectionOneHomeContent">
        <Logo width={164} />
        <Row>
          <h2 className="mb-4 mt-5">{t('common.welcome')}</h2>
        </Row>
        <Row>
          <h4 className="mb-5">{t('vote.home-desc')}</h4>
        </Row>

        <div className="w-100">
          <Link
            className="d-grid d-md-block w-100"
            href={getUrl(RouteTypes.BALLOT, router, electionRef, token)}
          >
            <Button
              color="secondary"
              outline={true}
              type="submit"
              icon={faArrowRight}
              position="right"
            >
              {t('vote.home-start')}
            </Button>
          </Link>
        </div>
        <Row className="noAds my-0">
          <p>{t('home.noAds')}</p>
        </Row>
        <Row>
          <Link href={MAJORITY_JUDGMENT_LINK}>
            <Button className="btn-black mt-2 mb-5">
              {t('common.about-mj')}
            </Button>
          </Link>
        </Row>
      </Col>
    </div>
  );
};

const Vote = ({ electionRef, token }: VoteInterface) => {
  return (
    <>
      <section>
        <GoToBallotConfirmDesktop electionRef={electionRef} token={token} />
        <GoToBallotConfirmMobile electionRef={electionRef} token={token} />
      </section>
      <section className="sectionTwoHome p-2 pb-5 text-center">
        <div className=" pt-5 mt-5">
          <AdvantagesRow />
        </div>
        <ExperienceRow />
        <Share />
      </section>
    </>
  );
};
export default Vote;

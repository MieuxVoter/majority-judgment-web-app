import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import Link from 'next/link';
import Footer from '@components/layouts/Footer';
import ShareRow from '@components/Share';
import Button from '@components/Button';
import ExperienceRow from '@components/Experience';
import AdvantagesRow from '@components/Advantages';
import Logo from '@components/Logo';
import {BALLOT} from '@services/routes';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';


export async function getServerSideProps({query: {pid, tid}, locale}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['resource'])),
      electionId: pid,
      token: tid || null,
    },
  }
}

interface VoteInterface {
  electionId: string;
  token?: string;
}


const GoToBallotConfirm = ({electionId, token}) => {

  const {t} = useTranslation();

  return (
    <div className="sectionOneHomeForm">
      <Row className="sectionOneHomeRowOne">
        <Col className="sectionOneHomeContent">
          <Logo height="128" />
          <Row>
            <h2 className="mb-4 mt-5">{t('common.welcome')}</h2>
          </Row>
          <Row>
            <h4 className="mb-5">
              {t('vote.home-desc')}
            </h4>
          </Row>

          <Row>
            <Link href={`${BALLOT}/${electionId}/${token ? token : ""}`}>
              <Button
                color="secondary"
                outline={true}
                type="submit"
                icon={faArrowRight}
                position="right"
              >
                {t('vote.home-start')}</Button>
            </Link>
          </Row>
          <Row className="noAds my-0">
            <p>{t('home.noAds')}</p>
          </Row>
          <Row>
            <Link href="https://mieuxvoter.fr/le-jugement-majoritaire">
              <Button className="btn-black mt-2 mb-5">
                {t('common.about-mj')}
              </Button>
            </Link>
          </Row>
        </Col>
      </Row >
    </div >
  )
}

const Vote = ({electionId, token}: VoteInterface) => {

  return (
    <>
      <section>
        <GoToBallotConfirm electionId={electionId} token={token} />
      </section>
      <section className="sectionTwoHome">
        <AdvantagesRow />
        <ExperienceRow />
        <ShareRow />
      </section>
    </>
  );
};
export default Vote;

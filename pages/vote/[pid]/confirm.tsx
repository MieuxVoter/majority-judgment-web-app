import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Row, Button } from 'reactstrap';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import PaypalNoLogo from "@components/banner/PaypalNoLogo";
import Gform from '@components/banner/Gform';
import Error from '@components/Error';
import { getDetails, apiErrors } from '@services/api';
import config from '../../../next-i18next.config.js';
import { motion } from 'framer-motion';

export async function getServerSideProps({ query: { pid }, locale }) {
  const [details, translations] = await Promise.all([
    getDetails(pid),
    serverSideTranslations(locale, [], config),
  ]);

  if (typeof details === 'string' || details instanceof String) {
    return { props: { err: details.slice(1, -1), ...translations } };
  }

  if (!details.candidates || !Array.isArray(details.candidates)) {
    return { props: { err: 'Unknown error', ...translations } };
  }

  return {
    props: {
      ...translations,
      invitationOnly: details.on_invitation_only,
      restrictResults: details.restrict_results,
      candidates: details.candidates.map((name, i) => ({ id: i, label: name })),
      title: details.title,
      numGrades: details.num_grades,
      pid: pid,
    },
  };
}

const VoteSuccess = ({ title, invitationOnly, pid, err }) => {
  const { t } = useTranslation();
  if (err && err !== '') {
    return <Error msg={apiErrors(err, t)} />;
  }

  return (
    <Container className="full-height-container">
      <Head>
        <title>{t('resource.voteSuccess')}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>

      <motion.div
        className="mx-auto"
        initial={{ scale: 1, paddingBottom: '200px' }}
        animate={{ scale: 0.5, paddingBottom: '0px' }}
        transition={{
          type: 'spring',
          damping: 100,
          delay: 3,
        }}
      >
        <Row>
          <motion.div
            className="main-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 20,
              delay: 1,
            }}
          >
            <motion.div
              className="vote-animation"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 1,
              }}
            >
              <img src="/vote.svg" />
            </motion.div>
            <motion.div
              className="star-animation"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                damping: 20,
                delay: 2,
              }}
            >
              <img src="/vote-star.svg" />
            </motion.div>
          </motion.div>
        </Row>
      </motion.div>

      <motion.div
        className=""
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: -70 }}
        transition={{
          type: 'spring',
          damping: 100,
          delay: 4,
        }}
      >
        <Row className="mt-4 px-3 confirmRowOne">
          <Col className="text-center">
            <h2 className="confirmH2">{t('resource.voteSuccess')}</h2>
            <Button className="voteDesktop mx-auto mt-4 mb-5">
              {t('Voir les résultats')}
              <img src="/arrow-white.svg" />
            </Button>
            <Button className="voteMobile mx-auto mt-4 mb-5">
              {t('Voir les résultats')}
              <img src="/arrow-white.svg" />
            </Button>
          </Col>
        </Row>
        <Row className="confirmRowTwo justify-content-center mb-5 px-4">
          <Col className="confirmLeft">
            <h2 className="confirmH2 mb-4">
              {t('Découvrez le jugement majoritaire')}
            </h2>
            <p>
              {t(
                'créé par des chercheurs français, le jugement majoritaire est un mode de scrutin qui améliore l’expressivité des électeurs et fournit le meilleur consensus.'
              )}
            </p>
            <Link href="/">
              <div>
                {t('En savoir plus')}
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </Link>
          </Col>
          <Col className="confirmRight">
            <Row className="align-items-center">
              <Col xs="8" className="pr-0">
                <h2 className="confirmH2">{t('Soutenez Mieux Voter')}</h2>
              </Col>
              <Col xs="4" className="text-right">
                <img src="/logo-red-blue.svg" alt="logo of Mieux Voter" />
              </Col>
            </Row>
            <p className="pt-4">
              {t(
                'Mieux Voter est une association transpartisane et sans but lucratif. En adhérant à l’association, vous contribuez à financer son fonctionnement et ses activités. '
              )}
            </p>
          </Col>
        </Row>

        <Row>
          <Col className="text-center col-md-3 mx-auto my-5 thanksVote">
            <h4>{t('resource.thanks')}</h4>
            <p>
              {t('Aidez nous à améliorer l’application en cliquant ci-dessous')}
            </p>
            <Gform className="btn btn-secondary mt-3 mx-auto" />
          </Col>
        </Row>

        <div className="mx-auto my-5">
          <Row className="justify-content-center">
            <Link href="https://www.facebook.com/mieuxvoter.fr/">
              <img src="/facebook.svg" />
            </Link>
            <p className="m-0">
              {t('Faites découvrir l’application a vos amis')}
            </p>
          </Row>
        </div>
      </motion.div>
    </Container>
  );
};
export default VoteSuccess;

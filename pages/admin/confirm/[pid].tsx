import { createRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  getDetails,
  apiErrors,
  ELECTION_NOT_STARTED_ERROR,
} from '@services/api';
import { Col, Container, Row, Button } from 'reactstrap';
import Link from 'next/link';
import {
  faCopy,
  faVoteYea,
  faExclamationTriangle,
  faExternalLinkAlt,
  faPollH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CopyField from '@components/CopyField';
import Error from '@components/Error';
import Facebook from '@components/banner/Facebook';
import Twitter from '@components/banner/Twitter';
import config from '../../../next-i18next.config.js';
import { AnimatePresence, motion } from 'framer-motion';
export async function getServerSideProps({ query: { pid }, locale }) {
  let [details, translations] = await Promise.all([
    getDetails(pid, console.log, console.log),
    serverSideTranslations(locale, [], config),
  ]);

  // if (details.includes(ELECTION_NOT_STARTED_ERROR)) {
  //   details = { title: "", on_invitation_only: true, restrict_results: true };
  // } else {
  //   if (typeof details === "string" || details instanceof String) {
  //     return { props: { err: details, ...translations } };
  //   }

  //   if (!details.title) {
  //     return { props: { err: "Unknown error", ...translations } };
  //   }
  // }

  return {
    props: {
      invitationOnly: details.on_invitation_only,
      restrictResults: details.restrict_results,
      title: details.title,
      pid: pid,
      ...translations,
    },
  };
}

const ConfirmElection = ({
  title,
  restrictResults,
  invitationOnly,
  pid,
  err,
}) => {
  const { t } = useTranslation();

  if (err) {
    return <Error msg={t(apiErrors(err))} />;
  }

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'http://localhost';
  const urlVote = new URL(`/vote/${pid}`, origin);
  const urlResult = new URL(`/result/${pid}`, origin);

  const electionLink = invitationOnly ? (
    <>
      <p className="mb-1">
        {t(
          'Voters received a link to vote by email. Each link can be used only once!'
        )}
      </p>
    </>
  ) : (
    <>
      <CopyField
        value={urlVote.href}
        iconCopy={faCopy}
        iconOpen={faExternalLinkAlt}
        text={''}
      />
    </>
  );
  const fb = invitationOnly ? null : (
    <Facebook
      className="btn btn-sm btn-outline-light  m-2"
      text={t('Share election on Facebook')}
      url={urlVote}
      title={'app.mieuxvoter.fr'}
    />
  );
  const tw = invitationOnly ? null : (
    <Twitter
      className="btn btn-sm btn-outline-light  m-2"
      text={t('Share election on Twitter')}
      url={urlVote}
      title={'app.mieuxvoter.fr'}
    />
  );
  const participate = invitationOnly ? null : (
    <>
      <Col className="col-lg-3 text-center">
        <Link href={`/vote/${pid}`}>
          <a target="_blank" rel="noreferrer" className="btn btn-success">
            <FontAwesomeIcon icon={faVoteYea} />
            {t('resource.participateBtn')}
          </a>
        </Link>
      </Col>
    </>
  );

  return (
    <Container className="full-height-container">
      <Head>
        <title>{t('Successful election creation!')}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t('common.application')}
        />
      </Head>

      <motion.div
        className="mx-auto row"
        initial={{ scale: 1, paddingBottom: '200px' }}
        animate={{ scale: 0.5, paddingBottom: '0px' }}
        transition={{
          type: 'spring',
          damping: 100,
          delay: 4,
        }}
      >
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
          <img src="/urne-vide.svg" />
          <motion.div
            className="letter-animation"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 2,
            }}
          >
            <img src="/urne-letter.svg" />
          </motion.div>
          <motion.div
            className="star-animation"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              damping: 20,
              delay: 3,
            }}
          >
            <img className="urne-fronjt" src="/urne-star.svg" />
          </motion.div>
          <img className="urne-front" src="/urne-front.svg" />
        </motion.div>
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
        <Row className="mt-5">
          <Col className="text-center mx-auto success-title" lg="3">
            <h2>{t('Successful election creation!')}</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className=" mx-auto" lg="4">
            <div className="p-4 pb-5">
              <CopyField
                value={urlVote}
                iconCopy={faCopy}
                iconOpen={faExternalLinkAlt}
                text={t('Copier le lien du vote')}
              />
              <CopyField
                value={urlResult}
                iconCopy={faCopy}
                iconOpen={faExternalLinkAlt}
                text={t('Copier le lien des résultats')}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-4 mb-4 justify-content-center">
          {/* {participate}
        <Col className="text-center col-lg-3">
          <Link href={`/result/${pid}`}>
            <a target="_blank" rel="noreferrer" className="btn btn-secondary">
              <FontAwesomeIcon icon={faPollH}  />
              {t("resource.resultsBtn")}
            </a>
          </Link>
        </Col> */}
          <Button className="cursorPointer btn-validation mb-5">
            {t('Administrez le vote')}
            <img src="/arrow-white.svg" />
          </Button>
        </Row>
        <Row className="mt-5">
          <Col className="text-center offset-lg-3" lg="6">
            {fb}
            {tw}
            {t('Partagez l’élection')}
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ConfirmElection;

import { createRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getDetails, apiErrors } from "@services/api";
import { Col, Container, Row } from "reactstrap";
import Link from "next/link";
import {
  faCopy,
  faVoteYea,
  faExclamationTriangle,
  faExternalLinkAlt,
  faPollH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyField from "@components/CopyField";
import Error from "@components/Error";
import Facebook from "@components/banner/Facebook";
import config from "../../../next-i18next.config.js";

export async function getServerSideProps({ query: { pid }, locale }) {
  const [details, translations] = await Promise.all([
    getDetails(pid),
    serverSideTranslations(locale, [], config),
  ]);

  if (typeof details === "string" || details instanceof String) {
    return { props: { err: details, ...translations } };
  }

  if (!details.candidates || !Array.isArray(details.candidates)) {
    return { props: { err: "Unknown error", ...translations } };
  }

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
    return <Error value={apiErrors(err, t)} />;
  }

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost";
  const urlVote = new URL(`/vote/${pid}`, origin);
  const urlResult = new URL(`/result/${pid}`, origin);

  const electionLink = invitationOnly ? (
    <>
      <p className="mb-1">
        {t(
          "Voters received a link to vote by email. Each link can be used only once!"
        )}
      </p>
    </>
  ) : (
    <>
      <p className="mb-1">{t("Voting address")}</p>
      <CopyField
        value={urlVote.href}
        iconCopy={faCopy}
        iconOpen={faExternalLinkAlt}
        t={t}
      />
    </>
  );
  const fb = invitationOnly ? null : (
    <Facebook
      className="btn btn-sm btn-outline-light  m-2"
      text={t("Share election on Facebook")}
      url={urlVote}
      title={"app.mieuxvoter.fr"}
    />
  );

  const participate = invitationOnly ? null : (
    <>
      <Col className="col-lg-3 text-center mr-10">
        <Link href={`/vote/${pid}`}>
          <a target="_blank" rel="noreferrer" className="btn btn-success">
            <FontAwesomeIcon icon={faVoteYea} className="mr-2" />
            {t("resource.participateBtn")}
          </a>
        </Link>
      </Col>
    </>
  );

  return (
    <Container>
      <Head>
        <title>{t("Successful election creation!")}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t("common.application")}
        />
      </Head>

      <Row className="mt-5">
        <Col className="text-center offset-lg-3" lg="6">
          <h2>{t("Successful election creation!")}</h2>
          {fb}
        </Col>
      </Row>

      <Row className="mt-5 mb-4">
        <Col className="offset-lg-3" lg="6">
          <h3 className="mb-3 text-center">{title}</h3>
          <h5 className="mb-3 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {t("Keep these links carefully")}
          </h5>
          <div className="border rounded p-4 pb-5">
            {electionLink}

            <p className="mt-4 mb-1">{t("Results address")}</p>
            <CopyField
              value={urlResult}
              iconCopy={faCopy}
              iconOpen={faExternalLinkAlt}
              t={t}
            />
          </div>
        </Col>
      </Row>
      <Row className="mt-4 mb-4 justify-content-md-center">
        {participate}
        <Col className="text-center col-lg-3">
          <Link href={`/result/${pid}`}>
            <a target="_blank" rel="noreferrer" className="btn btn-secondary">
              <FontAwesomeIcon icon={faPollH} className="mr-2" />
              {t("resource.resultsBtn")}
            </a>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmElection;

import Head from "next/head";
import {Col, Container, Row} from "reactstrap";
import Link from "next/link";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Paypal from "@components/banner/Paypal";
import Gform from "@components/banner/Gform";
import Error from "@components/Error";
import {getDetails, apiErrors} from "@services/api";

export async function getServerSideProps({query: {pid}, locale}) {
  const [details, translations] = await Promise.all([
    getDetails(pid),
    serverSideTranslations(locale, ["resource", "common", "locale"]),
  ]);

  if (typeof details === "string" || details instanceof String) {
    return {props: {err: res.slice(1, -1), ...translations}};
  }

  if (!details.candidates || !Array.isArray(details.candidates)) {
    return {props: {err: "Unknown error", ...translations}};
  }

  return {
    props: {
      ...translations,
      invitationOnly: details.on_invitation_only,
      restrictResults: details.restrict_results,
      candidates: details.candidates.map((name, i) => ({id: i, label: name})),
      title: details.title,
      numGrades: details.num_grades,
      pid: pid,
    },
  };
}


const VoteSuccess = ({title, invitationOnly, pid, err}) => {
  const {t} = useTranslation();
  if (err && err !== "") {
    return <Error value={apiErrors(err, t)} />;
  }

  return (
    <Container>
      <Head>
        <title>{t("resource.voteSuccess")}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          property="og:description"
          key="og:description"
          content={t("common.application")}
        />
      </Head>
      <Row>
        <Link href="/" className="d-block ms-auto me-auto mb-4">
          <img src="/logos/logo-line-white.svg" alt="logo" height="128" />
        </Link>
      </Row>
      <Row className="mt-4">
        <Col className="text-center offset-lg-3" lg="6">
          <h2>{t("resource.voteSuccess")}</h2>
          <p>{t("resource.thanks")}</p>
          <div className="mt-3">
            <Gform className="btn btn-secondary" />
          </div>
          <div className="mt-5">
            <Paypal btnColor="btn-success" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default VoteSuccess;

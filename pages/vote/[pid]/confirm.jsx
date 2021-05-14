import Head from "next/head";
import { Col, Container, Row } from "reactstrap";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Paypal from "@components/banner/Paypal";
import Gform from "@components/banner/Gform";
import { getDetails } from "@services/api";
import config from "../../../next-i18next.config.js";

export async function getServerSideProps({ query: { pid }, locale }) {
  const [res, translations] = await Promise.all([
    getDetails(
      pid,
      (res) => ({ ok: true, ...res }),
      (err) => ({ ok: false, err })
    ),
    serverSideTranslations(locale, [], config),
  ]);

  if (!res.ok) {
    return { props: { err: res.err, ...translations } };
  }

  return {
    props: {
      ...translations,
      invitationOnly: res.on_invitation_only,
      restrictResults: res.restrict_results,
      candidates: res.candidates.map((name, i) => ({ id: i, label: name })),
      title: res.title,
      numGrades: res.num_grades,
      pid: pid,
    },
  };
}

const VoteSuccess = ({ title, invitationOnly, pid }) => {
  const { t } = useTranslation();
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
        <Link href="/">
          <a className="d-block ml-auto mr-auto mb-4">
            <img src="/logos/logo-line-white.svg" alt="logo" height="128" />
          </a>
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

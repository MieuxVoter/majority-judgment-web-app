import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Container, Row, Col, Button, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import config from "../next-i18next.config.js";

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [], config)),
  },
});

const Home = () => {
  const [title, setTitle] = useState(null);
  const { t } = useTranslation();
  return (
    <Container>
      <form autoComplete="off">
        <Row>
          <img
            src="logos/logo-line-white.svg"
            alt="logo of Mieux Voter"
            height="128"
            className="d-block ml-auto mr-auto mb-4"
          />
        </Row>
        <Row>
          <Col className="text-center">
            <h3>{t("common.valueProp")}</h3>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs="12" md="9" xl="6" className="offset-xl-2">
            <Input
              placeholder={t("resource.writeQuestion")}
              autoFocus
              required
              className="mt-2"
              name="title"
              value={title ? title : ""}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="250"
            />
          </Col>
          <Col xs="12" md="3" xl="2">
            <Link href={{ pathname: "/new/", query: { title: title } }}>
              <Button
                type="submit"
                className="btn btn-block btn-secondary mt-2"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                {t("resource.start")}
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>{t("resource.noAds")}</p>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default Home;

import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import { useTranslation } from "next-i18next";

const Error = (props) => {
  const { t } = useTranslation();
  return (
    <Container className="full-height-container">
      <Row>
        <Link href="/">
          <a className="d-block ml-auto mr-auto mb-4">
            <img src="/logos/logo.svg" alt="logo" height="128" />
          </a>
        </Link>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <h4>{props.value}</h4>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="my-3" sm="6">
          <Link href="/">
            <a className="btn btn-secondary m-auto">{t("common.backHomepage")}</a>
          </Link>
        </Col>
        <Col className="my-3" sm="6">
          <a
            href="mailto:app@mieuxvoter.fr?subject=[HELP]"
            className="btn btn-success m-auto"
          >
            {t("resource.help")}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;

import Link from "next/link";
import {Container, Row, Col} from "reactstrap";
import {useTranslation} from "next-i18next";

const Error = (props) => {
  const {t} = useTranslation();
  return (
    <Container>
      <Row>
        <Link href="/" className="d-block ms-auto me-auto mb-4">
          <img src="/logos/logo-line-white.svg" alt="logo" height="128" />
        </Link>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <h4>{props.value}</h4>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-right me-4">
          <Link href="/" className="btn btn-secondary">{t("common.backHomepage")}</Link>
        </Col>
        <Col className="text-left ms-4">
          <a
            href="mailto:app@mieuxvoter.fr?subject=[HELP]"
            className="btn btn-success"
          >
            {t("resource.help")}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;

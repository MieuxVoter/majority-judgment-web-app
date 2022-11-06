import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { CONTACT_MAIL } from '@services/constants';

const Error = ({ msg }) => {
  const { t } = useTranslation();
  return (
    <Container className="full-height-container">
      <Row>
        <Link href="/">
          <a className="d-block mx-auto mb-4">
            <img src="/logos/logo.svg" alt="logo" height="128" />
          </a>
        </Link>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <h4>{t(msg)}</h4>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="my-3" sm="6">
          <Link href="/">
            <a className="btn btn-secondary m-auto">
              {t('common.back-homepage')}
            </a>
          </Link>
        </Col>
        <Col className="my-3" sm="6">
          <a
            href={`mailto:${CONTACT_MAIL}?subject=[HELP]`}
            className="btn btn-success m-auto"
          >
            {t('error.help')}
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;

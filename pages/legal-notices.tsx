import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import config from '../next-i18next.config.js';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [], config)),
  },
});

const LegalNotices = (props) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Row>
        <Link href="/" className="d-block ml-auto mr-auto mb-4">
          <img src="/logos/logo-line-white.svg" alt="logo" height="128" />
        </Link>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <h1>{t('resource.legalNotices')}</h1>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h3 className="bold">Editeur</h3>
          <p>
            Cette Application est éditée par l’association loi 1901{' '}
            <a
              href="https://mieuxvoter.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              “Mieux Voter”
            </a>
            , dont le siège social est situé au 59 rue Saint-André des Arts, à
            Paris (75006).
          </p>

          <p>
            Adresse email :{' '}
            <a href="mailto:app@mieuxvoter.fr" className="text-light">
              app@mieuxvoter.fr
            </a>
          </p>
          <p>
            <b>Directeur de la publication</b>
            <br />
            Pierre-Louis Guhur
          </p>
          <h3 className="mt-2 bold">Hébergement</h3>
          <ul>
            <li>Base de données : Institut Systèmes Complexes, Paris ;</li>
            <li>
              Réseau de diffusion de contenu (CDN) : Netlify, 2325 3rd Street,
              Suite 215, San Francisco, California 94107.
            </li>
          </ul>
          <h3 className="mt-2 bold">&OElig;uvres graphiques</h3>
          <p>
            Les illustrations et graphismes sur cette application sont
            l’&oelig;uvre de l’association Mieux Voter.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Link href="/" className="btn btn-secondary">
            {t('common.back-homepage')}
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default LegalNotices;

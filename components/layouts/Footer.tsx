import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button, Row, Col } from 'reactstrap';
import Logo from '@components/Logo';
import LanguageSelector from '@components/layouts/LanguageSelector';

const Footer = () => {
  const { t } = useTranslation();

  const menu = [
    {
      component: <Logo title={false} />,
    },
    {
      component: <Link href="/">{t('menu.majority-judgment')}</Link>,
    },
    {
      component: (
        <Link
          href="https://mieuxvoter.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('menu.whoarewe')}
        </Link>
      ),
    },
    {
      component: <Link href="/faq">{t('menu.faq')}</Link>,
    },
    {
      component: <Link href="/">{t('menu.news')}</Link>,
    },
    {
      component: (
        <a href="mailto:app@mieuxvoter.fr?subject=[HELP]">
          {t('menu.contact-us')}
        </a>
      ),
    },
    {
      component: (
        <div>
          <LanguageSelector />
        </div>
      ),
    },
  ];

  return (
    <footer>
      <Row>
        <Col className="col-auto me-auto">
          <Row className="gx-3">
            {menu.map((item, i) => (
              <Col key={i} className="col-auto d-flex align-items-center">
                {item.component}
              </Col>
            ))}
          </Row>
        </Col>
        <Col className="col-auto">
          <Button outline={false} color="info" className="noshadow">
            <a href="/">{t('common.support-us')}</a>
          </Button>
        </Col>
      </Row>
    </footer>
  );
};
export default Footer;

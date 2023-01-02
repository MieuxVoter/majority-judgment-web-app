import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button, Row, Col } from 'reactstrap';
import Logo from '@components/Logo';
import LanguageSelector from '@components/layouts/LanguageSelector';
import { useAppContext } from '@services/context';
import {
  MAJORITY_JUDGMENT_LINK,
  NEWS_LINK,
  PAYPAL,
  WHO_WE_ARE_LINK,
} from '@services/constants';

const Footer = () => {
  const { t } = useTranslation();
  const [app, _] = useAppContext();

  if (app.fullPage) {
    return null;
  }

  const menu = [
    {
      component: <Logo title={false} />,
    },
    {
      component: (
        <a
          href={MAJORITY_JUDGMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('menu.majority-judgment')}
        </a>
      ),
    },
    {
      component: (
        <a href={WHO_WE_ARE_LINK} target="_blank" rel="noopener noreferrer">
          {t('menu.whoarewe')}
        </a>
      ),
    },
    {
      component: <Link href="/faq">{t('menu.faq')}</Link>,
    },
    {
      component: <Link href={NEWS_LINK}>{t('menu.news')}</Link>,
    },
    {
      component: (
        <a href="mailto:app@mieuxvoter.fr?subject=[HELP]">
          {t('menu.contact-us')}
        </a>
      ),
    },
    {
      component: <LanguageSelector selectedSize={14} />,
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
            <a href={PAYPAL}>{t('common.support-us')}</a>
          </Button>
        </Col>
      </Row>
    </footer>
  );
};
export default Footer;

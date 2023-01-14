import Link from 'next/link';
import { useRouter } from 'next/router';
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
import { getUrl, RouteTypes } from '@services/routes';

const Footer = () => {
  const { t } = useTranslation();
  const router = useRouter();
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
      component: (
        <Link href={getUrl(RouteTypes.FAQ, router)}>{t('menu.faq')}</Link>
      ),
    },
    {
      component: (
        <a target="_blank" rel="noopener noreferrer" href={NEWS_LINK}>
          {t('menu.news')}
        </a>
      ),
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
          <a href={PAYPAL}>
            <Button outline={false} color="info" className="noshadow">
              {t('common.support-us')}
            </Button>
          </a>
        </Col>
      </Row>
    </footer>
  );
};
export default Footer;

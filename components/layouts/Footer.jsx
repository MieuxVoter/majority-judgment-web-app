import Link from "next/link";
import {useTranslation} from "next-i18next";
import {Button, Row, Col} from "reactstrap";
import Logo from '@components/Logo.jsx';
import LanguageSelector from "@components/layouts/LanguageSelector";

const Footer = () => {
  const linkStyle = {whiteSpace: "nowrap"};
  const {t} = useTranslation();

  // const [bboxLink1, link1] = useBbox();
  // const [bboxLink2, link2] = useBbox();
  // const [bboxLink3, link3] = useBbox();
  // const [bboxLink4, link4] = useBbox();
  // const [bboxLink5, link5] = useBbox();

  //<Col className="col-
  const menu = [
    {
      component: (
        <Logo title={false} />
      )
    },
    {
      component: (
        <Link href="/" style={linkStyle}>{t("menu.majority-judgment")}</Link>
      )
    },
    {
      component: (
        <Link
          href="https://mieuxvoter.fr/"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          {t("menu.whoarewe")}
        </Link>
      )
    },
    {
      component: (
        <Link href="/faq" style={linkStyle}>
          {t("menu.faq")}
        </Link>
      )
    },
    {
      component: (
        <Link href="/" style={linkStyle}>
          {t("menu.news")}
        </Link>
      )
    },
    {
      component: (
        <a href="mailto:app@mieuxvoter.fr?subject=[HELP]" style={linkStyle}>
          {t('menu.contact-us')}
        </a>
      )
    },
    {
      component: (
        <div><LanguageSelector /></div>
      )
    }
  ]

  return (
    <footer>
      <Row>
        <Col className="col-auto me-auto">
          <Row>
            {menu.map((item, i) =>
              <Col key={i} className="col-auto d-flex align-items-center">
                {item.component}
              </Col>

            )}
          </Row>
        </Col>
        <Col className="col-auto">
          <Button outline={false} color="info" className='noshadow'>
            <a href="/">
              {t('common.support-us')}
            </a>
          </Button>
        </Col>
      </Row>
    </footer >
  );
};
export default Footer;

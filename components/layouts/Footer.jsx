import Link from "next/link";
import { useTranslation } from "next-i18next";
import Paypal from "../banner/Paypal";
import { useBbox } from "./useBbox";
import { Button, Row, Col } from "reactstrap";
import LanguageSelector from "./LanguageSelector";

const Footer = () => {
  const linkStyle = { whiteSpace: "nowrap" };
  const { t } = useTranslation();

  const [bboxLink1, link1] = useBbox();
  const [bboxLink2, link2] = useBbox();
  const [bboxLink3, link3] = useBbox();
  const [bboxLink4, link4] = useBbox();
  const [bboxLink5, link5] = useBbox();

  return (
    <footer className="text-center">
      <div>
        <Row className="tacky">
          <Col className="col-md-10 col-sm-10">
          <Row className="footerRow">
            <Col className="col-md-1 footerLogo">
              <img src="/logos/logo-footer.svg" alt="logo of Mieux Voter" />
            </Col>
            <div ref={link1}
              className={bboxLink1.top === bboxLink2.top ? "" : "no-tack"}
              >
              <Link href="/" style={linkStyle}>
                Le jugement majoritaire
          </Link>
            </div>
            <div ref={link2}
              className={bboxLink2.top === bboxLink3.top ? "" : "no-tack"}
              >
              <Link
                href="https://mieuxvoter.fr/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {t("Who are we?")}
              </Link>
            </div>
            <div ref={link3}
              className={bboxLink3.top === bboxLink4.top ? "" : "no-tack"}
              >
              <Link href="/faq" style={linkStyle}>
                {t("FAQ")}
              </Link>
            </div>
            <div ref={link4}
              className={bboxLink4.top === bboxLink5.top ? "" : "no-tack"}
              >
              <Link href="/" style={linkStyle}>
                Actualités
          </Link>
            </div>
            <div ref={link5}>
              <a href="mailto:app@mieuxvoter.fr?subject=[HELP]" style={linkStyle}>
                Nous contacter
            </a>
            </div>
            <div><LanguageSelector /></div>
            </Row>
          </Col>
          <Col className="footerButton">
            <Col className="col-xl-10 col-md-12 offset-xl-2">
              <Button className="btn-primary btn-footer">
                <a href="/">
                  Soutenez-nous
                  </a>
              </Button>
            </Col>
          </Col>
        </Row>
        
      </div>
    </footer>
  );
};
export default Footer;

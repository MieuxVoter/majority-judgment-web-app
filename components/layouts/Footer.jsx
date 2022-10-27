import Link from "next/link";
import {useTranslation} from "next-i18next";
import {Button, Row, Col} from "reactstrap";
import {useBbox} from "@components/layouts/useBbox";
import Paypal from "@components/banner/Paypal";
import Logo from '@components/Logo.jsx';
import LanguageSelector from "@components/layouts/LanguageSelector";

const Footer = () => {
  const linkStyle = {whiteSpace: "nowrap"};
  const {t} = useTranslation();

  const [bboxLink1, link1] = useBbox();
  const [bboxLink2, link2] = useBbox();
  const [bboxLink3, link3] = useBbox();
  const [bboxLink4, link4] = useBbox();
  const [bboxLink5, link5] = useBbox();

  //<Col className="col-
  return (
    <footer>
      <Row>
        <Col className="col-auto me-auto">
          <Button className="btn-info">
            <a href="/">
              Soutenez-nous
            </a>
          </Button>
        </Col>
        <Col className="col-auto ms-auto">
          <Button className="btn-info">
            <a href="/">
              Soutenez-nous
            </a>
          </Button>
        </Col>
      </Row>
    </footer >
  );
};
export default Footer;

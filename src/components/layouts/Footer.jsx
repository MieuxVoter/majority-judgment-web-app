/* eslint react/prop-types: 0 */
import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Paypal from "../banner/Paypal";
import {useBbox} from "./useBbox";
import "./footer.css";

const Footer = props => {
  const linkStyle = { whiteSpace: "nowrap" };
  const { t } = props;

  const [bboxLink1, link1] = useBbox();
  const [bboxLink2, link2] = useBbox();
  const [bboxLink3, link3] = useBbox();
  const [bboxLink4, link4] = useBbox();
  const [bboxLink5, link5] = useBbox();
  const [bboxLink6, link6] = useBbox();

  return (
    <footer className="text-center">
      <div>
        <ul className="tacky">
          <li ref={link1} className={(bboxLink1.top===bboxLink2.top)?"":"no-tack"}>
            <Link to="/" style={linkStyle} >
              {t("Homepage")}
            </Link>
          </li>
          <li ref={link2} className={(bboxLink2.top===bboxLink3.top)?"":"no-tack"}>
            {" "}
            <a
              href="https://github.com/MieuxVoter"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {t("Source code")}
            </a>
          </li>
          <li ref={link3} className={(bboxLink3.top===bboxLink4.top)?"":"no-tack"}>
            <a
              href="https://mieuxvoter.fr/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {t("Who are we?")}
            </a>
          </li>
            <li ref={link4} className={(bboxLink4.top===bboxLink5.top)?"":"no-tack"}>
                <Link to="/privacy-policy" style={linkStyle}>
                    {t("Privacy policy")}
                </Link>
            </li>
            <li ref={link5} className={(bboxLink5.top===bboxLink6.top)?"":"no-tack"}>
                <Link to="/legal-notices" style={linkStyle}>
                    {t("Legal notices")}
                </Link>
            </li>
            <li ref={link6}>
                <Link to="/faq" style={linkStyle}>
                    {t("FAQ")}
                </Link>
            </li>
        </ul>
      </div>
      <div className="mt-3">
        <Paypal btnColor="btn-primary" />
      </div>
    </footer>
  );
};
export default withTranslation()(Footer);

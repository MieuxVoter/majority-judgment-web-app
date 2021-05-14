import Link from "next/link";
import {useTranslation} from "next-i18next";
import Paypal from "../banner/Paypal";
import {useBbox} from "./useBbox";

const Footer = () => {
  const linkStyle = {whiteSpace: "nowrap"};
  const {t} = useTranslation();

  const [bboxLink1, link1] = useBbox();
  const [bboxLink2, link2] = useBbox();
  const [bboxLink3, link3] = useBbox();
  const [bboxLink4, link4] = useBbox();
  const [bboxLink5, link5] = useBbox();
  const [bboxLink6, link6] = useBbox();
  const [bboxLink7, link7] = useBbox();

  return (
    <footer className="text-center">
      <div>
        <ul className="tacky">
          <li
            ref={link1}
            className={bboxLink1.top === bboxLink2.top ? "" : "no-tack"}
          >
            <Link href="/" style={linkStyle}>
              {t("Homepage")}
            </Link>
          </li>
          <li
            ref={link2}
            className={bboxLink2.top === bboxLink3.top ? "" : "no-tack"}
          >
            <Link href="/faq" style={linkStyle}>
              {t("FAQ")}
            </Link>
          </li>
          <li
            ref={link3}
            className={bboxLink3.top === bboxLink4.top ? "" : "no-tack"}
          >
            <a href="mailto:app@mieuxvoter.fr?subject=[HELP]" style={linkStyle}>
              {t("Need help?")}
            </a>
          </li>
          <li
            ref={link4}
            className={bboxLink4.top === bboxLink5.top ? "" : "no-tack"}
          >
            <a
              href="https://mieuxvoter.fr/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {t("Who are we?")}
            </a>
          </li>
          <li
            ref={link5}
            className={bboxLink5.top === bboxLink6.top ? "" : "no-tack"}
          >
            <Link href="/privacy-policy" style={linkStyle}>
              {t("Privacy policy")}
            </Link>
          </li>
          <li
            ref={link6}
            className={bboxLink6.top === bboxLink7.top ? "" : "no-tack"}
          >
            <Link href="/legal-notices" style={linkStyle}>
              {t("resource.legalNotices")}
            </Link>
          </li>
          <li ref={link7}>
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
        </ul>
      </div>
      <div className="mt-3">
        <Paypal btnColor="btn-primary" />
      </div>
    </footer>
  );
};
export default Footer;

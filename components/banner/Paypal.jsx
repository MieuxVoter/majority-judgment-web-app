import {useTranslation} from "next-i18next";
import {useRouter} from "next/router"
import {faPaypal} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Paypal = () => {
  const {t} = useTranslation();

  // FIXME generate a xx_XX string for locale version
  const {locale} = useRouter();
  let localeShort = locale.substring(0, 2);
  let localeComplete =
    localeShort.toLowerCase() + "_" + localeShort.toUpperCase();
  if (localeComplete === "en_EN") {
    localeComplete = "en_US";
  }
  const pixelLink =
    `https://www.paypal.com/${localeComplete}/i/scr/pixel.gif`;

  return (
    <div className="d-inline-block m-auto">
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
      >
        <button
          type="submit"
          className="btn btn-primary"
          title={t("PayPal - The safer, easier way to pay online!")}
        >
          {" "}
          <FontAwesomeIcon icon={faPaypal} className="mr-2" />
          {t("Support us !")}
        </button>
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="KB2Z7L9KARS7C" />
        <img alt="" border="0" src={pixelLink} width="1" height="1" />
      </form>
    </div>
  );
};

export default Paypal;

/* eslint react/prop-types: 0 */
import React from "react";
import i18n from "../../i18n";

const Helloasso = props => {
  const locale =
    i18n.language.substring(0, 2).toLowerCase() === "fr" ? "fr" : "en";
  const linkHelloAssoBanner =
    locale === "fr"
      ? "https://www.helloasso.com/associations/mieux-voter/formulaires/1/widget"
      : "https://www.helloasso.com/associations/mieux-voter/formulaires/1/widget/en";

  return (
    <a href={linkHelloAssoBanner} target="_blank" rel="noopener noreferrer">
      <img
        src={"/banner/" + locale + "/helloasso.png"}
        alt="support us on helloasso"
        style={{ width: props.width }}
      />
    </a>
  );
};

export default Helloasso;

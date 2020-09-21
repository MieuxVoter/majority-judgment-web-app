/* eslint react/prop-types: 0 */
import React from "react";
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";

import i18n from "../../i18n";

const LanguageSelector = () => {
  const selectHandler = e => {
    let locale = e.toLowerCase();
    if (locale === "gb") locale = "en";
    i18n.changeLanguage(locale);
  };

  let locale = i18n.language? i18n.language.substring(0, 2).toUpperCase() : "EN";
  if (locale === "EN") locale = "GB";
  return (
    <ReactFlagsSelect
      onSelect={selectHandler}
      countries={["GB", "FR", "ES", "DE", "RU"]}
      showOptionLabel={false}
      defaultCountry={locale}
      selectedSize={15}
      optionsSize={22}
      showSelectedLabel={false}
    />
  );
};

export default LanguageSelector;

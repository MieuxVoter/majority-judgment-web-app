import {useRouter} from 'next/router'
import ReactFlagsSelect from 'react-flags-select';

const LanguageSelector = () => {

  const router = useRouter();
  let localeShort = router.locale.substring(0, 2).toUpperCase();
  if (localeShort === "EN") localeShort = "GB";

  const selectHandler = e => {
    let locale = e.toLowerCase();
    if (locale === "gb") locale = "en";
    router.push("", "", {locale})
  };
  return (
    <ReactFlagsSelect
      onSelect={selectHandler}
      countries={
        // ["GB", "FR", "ES", "DE", "RU"]
        ["GB", "FR"]
      }
      showOptionLabel={true}
      selected={localeShort}
      selectedSize={15}
      optionsSize={22}
      showSelectedLabel={true}
      showSecondaryOptionLabel={false}
      customLabels={{ "GB": "Lang: EN", "FR": "Lang: FR" }}
      fullWidth={false}

      className="menu-flags"
    />
  );
};

export default LanguageSelector;

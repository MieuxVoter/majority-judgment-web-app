import {useRouter} from 'next/router';
import ReactFlagsSelect from 'react-flags-select';
import {getLocaleShort} from '@services/utils';


const LanguageSelector = (props) => {
  const router = useRouter();
  const localeShort = getLocaleShort(router);

  const selectHandler = (e) => {
    let locale = e.toLowerCase();
    if (locale === 'gb') locale = 'en';
    router.push('', '', {locale});
  };

  return (
    <ReactFlagsSelect
      onSelect={selectHandler}
      countries={
        // ["GB", "FR", "ES", "DE", "RU"]
        ['GB', 'FR']
      }
      selected={localeShort == "en" ? "GB" : localeShort.toUpperCase()}
      customLabels={{GB: 'English', FR: 'Francais'}}
      {...props}
      className="menu-flags"
    />
  );
};

export default LanguageSelector;

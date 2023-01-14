import { useRouter } from 'next/router';
import ReactFlagsSelect from 'react-flags-select';
import { getLocaleShort } from '@services/utils';

const LanguageSelector = (props) => {
  const router = useRouter();
  const localeShort = getLocaleShort(router);

  const selectHandler = (e) => {
    let locale = e.toLowerCase();
    if (locale === 'gb') locale = 'en';
    const { pathname, asPath, query } = router;
    // change just the locale and maintain all other route information including href's query
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <ReactFlagsSelect
      onSelect={selectHandler}
      countries={
        // ["GB", "FR", "ES", "DE", "RU"]
        ['GB', 'FR']
      }
      selected={localeShort == 'en' ? 'GB' : localeShort.toUpperCase()}
      customLabels={{ GB: 'English', FR: 'Francais' }}
      {...props}
      className="menu-flags"
    />
  );
};

export default LanguageSelector;

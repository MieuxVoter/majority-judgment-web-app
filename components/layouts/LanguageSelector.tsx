import { useRouter } from 'next/router';
import ReactFlagsSelect from 'react-flags-select';

const LanguageSelector = (props) => {
  const router = useRouter();
  let localeShort = router.locale.substring(0, 2).toUpperCase();
  if (localeShort === 'EN') localeShort = 'GB';

  const selectHandler = (e) => {
    let locale = e.toLowerCase();
    if (locale === 'gb') locale = 'en';
    router.push('', '', { locale });
  };
  return (
    <ReactFlagsSelect
      onSelect={selectHandler}
      countries={
        // ["GB", "FR", "ES", "DE", "RU"]
        ['GB', 'FR']
      }
      selected={localeShort}
      customLabels={{ GB: 'English', FR: 'Francais' }}
      {...props}
      className="menu-flags"
    />
  );
};

export default LanguageSelector;

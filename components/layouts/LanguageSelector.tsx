import { useRouter } from 'next/router';
import ReactFlagsSelect from 'react-flags-select';

const LanguageSelector = () => {
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
      className="menu-flags"
      selectedSize={14}
      selectedSize={14}
    />
  );
};

export default LanguageSelector;

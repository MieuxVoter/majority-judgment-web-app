import React from 'react';
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

import i18n from '../../i18n'



const LanguageSelector = () => {

    const selectHandler = (e) => {
        let locale=e.toLowerCase();
        if(locale==="gb")locale="en";
        i18n.changeLanguage(locale);
    };

    let locale=i18n.language.substring(0,2).toUpperCase();
    if(locale==="EN")locale="GB";
    return (<ReactFlagsSelect onSelect={selectHandler}
        className="text-primary"
        countries={["GB", "FR", "ES", "DE"]}
        showOptionLabel={false}
        defaultCountry={locale}
        selectedSize={14}
        optionsSize={14}
        showSelectedLabel={false}
        />);
};


export default LanguageSelector;
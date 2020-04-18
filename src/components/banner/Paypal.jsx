import React from 'react';
import i18n from '../../i18n'



const Paypal = (props) => {
    const localeStringShort=i18n.language.substring(0,2);
    const localeStringComplete=localeStringShort.toLowerCase()+"_"+localeStringShort.toUpperCase();
    const imageLink="https://www.paypalobjects.com/"+localeStringComplete+"/"+localeStringShort.toUpperCase()+"/i/btn/btn_donateCC_LG.gif";
    const pixelLink="https://www.paypal.com/"+localeStringComplete+"/i/scr/pixel.gif";
    return (
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="KB2Z7L9KARS7C" />
            <input type="image" src={imageLink} style={{border:"none"}} name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" border="0" src={pixelLink} width="1" height="1" />
        </form>);
};


export default Paypal;
import React from 'react';
import i18n from '../../i18n'



const Paypal = (props) => {
    let localeStringShort=i18n.language.substring(0,2);
    let localeStringComplete=localeStringShort.toLowerCase()+"_"+localeStringShort.toUpperCase();
    if(localeStringComplete==="en_EN"){
        localeStringComplete="en_US";
        localeStringShort="FR";
    }
    const imageLink="https://www.paypalobjects.com/"+localeStringComplete+"/"+localeStringShort.toUpperCase()+"/i/btn/btn_donateCC_LG.gif";
    const pixelLink="https://www.paypal.com/"+localeStringComplete+"/i/scr/pixel.gif";

    return (
        <div style={{backgroundColor:'#fff'}} className="d-inline-block m-auto pt-1 pr-1 pl-1 rounded">
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="KB2Z7L9KARS7C" />
            <input type="image" src={imageLink} style={{border:"none"}} name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" border="0" src={pixelLink} width="1" height="1" />
        </form></div>);
};


export default Paypal;
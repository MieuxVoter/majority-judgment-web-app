import React from 'react';
import i18n from '../../i18n'
import {withTranslation} from 'react-i18next';

import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Paypal = (props) => {
    const {t} = props;
    let localeStringShort=i18n.language.substring(0,2);
    let localeStringComplete=localeStringShort.toLowerCase()+"_"+localeStringShort.toUpperCase();
    if(localeStringComplete==="en_EN"){
        localeStringComplete="en_US";
    }
    const pixelLink="https://www.paypal.com/"+localeStringComplete+"/i/scr/pixel.gif";

    return (
        <div className="d-inline-block m-auto">
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <button type="submit" className="btn btn-primary"  title={t("PayPal - The safer, easier way to pay online!")}  > <FontAwesomeIcon icon={faPaypal} className="mr-2" />{t("Support us !")}</button>
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="KB2Z7L9KARS7C" />
            <img alt="" border="0" src={pixelLink} width="1" height="1" />
        </form></div>);
};


export default withTranslation()(Paypal);
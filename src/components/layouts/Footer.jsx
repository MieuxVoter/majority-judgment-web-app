import React, { Component, Fragment } from "react";
import {withTranslation} from 'react-i18next';
import { Link } from "react-router-dom";

import { FlagIcon } from '../flag'
import i18n from '../../i18n'
import Helloasso from "../banner/Helloasso";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



  render() {

  const buttonStyle = {backgroundColor: "black", padding: "0px", border: "0px",};
  const linkStyle = {whiteSpace: "nowrap"};
  const {t} = this.props;
  const countries = [
    {"l": "en", "flag": "gb"},
    {"l": "es", "flag": "es"},
    {"l": "fr", "flag": "fr"},
    {"l": "de", "flag": "de"},
  ];

    return (
      <footer className="text-center">
        <Link to="/" style={linkStyle}>{t("Homepage")}</Link>
        <span className="m-2">-</span>
        <a href="https://github.com/MieuxVoter" target="_blank" rel="noopener noreferrer" style={linkStyle}>{t("Source code")}</a>
        <span className="m-2">-</span>
        <a href="https://mieuxvoter.fr/" target="_blank" rel="noopener noreferrer" style={linkStyle} >{t("Who are we")}</a>
        <span className="m-2">-</span>
        {
        countries.map(({l, flag}, i) => (
        <Fragment key={i} >
          <button style={buttonStyle} onClick={() => i18n.changeLanguage(l)}>
            <FlagIcon code={flag}  />
          </button>
            {" "}
            </Fragment>
        ))
        }
          <div className="mt-3">
              <Helloasso width="150px" />
          </div>
      </footer>
    );
  }
}
export default withTranslation()(Footer);

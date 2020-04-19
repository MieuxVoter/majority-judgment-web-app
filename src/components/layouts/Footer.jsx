import React, { Component } from "react";
import {withTranslation} from 'react-i18next';
import { Link } from "react-router-dom";
import Paypal from "../banner/Paypal";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



  render() {

  const linkStyle = {whiteSpace: "nowrap"};
  const {t} = this.props;
    return (
      <footer className="text-center">
        <Link to="/" style={linkStyle}>{t("Homepage")}</Link>
        <span className="m-2">-</span>
        <a href="https://github.com/MieuxVoter" target="_blank" rel="noopener noreferrer" style={linkStyle}>{t("Source code")}</a>
        <span className="m-2">-</span>
        <a href="https://mieuxvoter.fr/" target="_blank" rel="noopener noreferrer" style={linkStyle} >{t("Who are we?")}</a>
          <div className="mt-3">
              <Paypal />
          </div>
      </footer>
    );
  }
}
export default withTranslation()(Footer);

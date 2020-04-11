import React, { Component } from "react";
import {withTranslation} from 'react-i18next';
import { Link } from "react-router-dom";

import { FlagIcon } from '../flag'
import i18n from '../../i18n'

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
  const buttonStyle = {backgroundColor: "black", padding: "0px", border: "0px"};
  const {t} = this.props;
    return (
      <footer className="text-center">
        <Link to="/">{t("Homepage")}</Link>
        <span className="m-2">-</span>
        <a href="https://github.com/MieuxVoter">{t("Source code")}</a>
        <span className="m-2">-</span>
        <a href="https://mieuxvoter.fr/">{t("Who are we")}</a>
        <span className="m-2">-</span>
	<button style={buttonStyle} onClick={() => i18n.changeLanguage('en')}>
	  <FlagIcon code={"gb"}  />
	</button>
		{" "}
	<button style={buttonStyle} onClick={() => i18n.changeLanguage('fr')}>
	  <FlagIcon code={"fr"}  />
	</button>
		{" "}
	<button style={buttonStyle} onClick={() => i18n.changeLanguage('es')}>
	  <FlagIcon code={"es"}  />
	</button>
        <div className="mt-2">{t("BetterVote")} &copy;</div>
      </footer>
    );
  }
}
export default withTranslation()(Footer);

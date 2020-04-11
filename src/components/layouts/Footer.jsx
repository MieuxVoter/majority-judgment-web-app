import React, { Component } from "react";
import {withTranslation} from 'react-i18next';
import { Link } from "react-router-dom";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
  const {t} = this.props;
    return (
      <footer className="text-center">
        <Link to="/">{t("Homepage")}</Link>
        <span className="m-2">-</span>
        <a href="https://github.com/MieuxVoter">{t("Source code")}</a>
        <span className="m-2">-</span>
        <a href="https://mieuxvoter.fr/">{t("Who are we")}</a>
        <div className="mt-2">{t("BetterVote")} &copy;</div>
      </footer>
    );
  }
}
export default withTranslation()(Footer);

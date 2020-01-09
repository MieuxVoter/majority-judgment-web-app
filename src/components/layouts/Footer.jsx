import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../logos/helloasso-logo.png";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer className="text-center">
        <Link to="/">Accueil</Link>
        <span className="m-2">-</span>
        <a href="https://github.com/MieuxVoter">Code source</a>
        <span className="m-2">-</span>
        <a href="https://mieuxvoter.fr/">Qui sommes nous ?</a>
	<a href="https://www.helloasso.com/associations/mieux-voter">
            <div className="mt-2">
              <div className="align-self-center">
                <img src={logo} alt="logo" height="32" />
              </div>
            </div>
        </a>
        <div className="mt-2">MieuxVoter &copy;</div>
      </footer>
    );
  }
}
export default Footer;

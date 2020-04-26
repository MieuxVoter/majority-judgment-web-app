/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import logo from "../../logos/logo-color.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "./LanguageSelector";

class Header extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { t } = this.props;
    return (
      <header>
        <Navbar color="light" light expand="md">
          <Link to="/" className="navbar-brand">
            <div className="d-flex flex-row">
              <div className="align-self-center">
                <img src={logo} alt="logo" height="32" />
              </div>
              <div className="align-self-center ml-2">
                <div className="logo-text">
                  <h1>
                    {t("Voting platform")}
                    <small>{t("Majority Judgment")}</small>
                  </h1>
                </div>
              </div>
            </div>
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="text-primary nav-link" to="/create-election/">
                  <FontAwesomeIcon icon={faRocket} className="mr-2" />
                  {t("Start an election")}
                </Link>
              </NavItem>
              <NavItem style={{ width: "150px" }}>
                <LanguageSelector />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
export default withTranslation()(Header);

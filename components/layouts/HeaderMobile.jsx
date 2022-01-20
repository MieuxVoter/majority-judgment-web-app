/* eslint react/prop-types: 0 */
import {useState} from "react";
import {Collapse, Navbar, NavbarToggler, Nav, NavItem} from "reactstrap";
import Link from "next/link";
import Head from "next/head";
import {useTranslation} from 'next-i18next'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRocket} from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "./LanguageSelector";


const Header = () => {
  const [isOpen, setOpen] = useState(false)

  const toggle = () => setOpen(!isOpen);

  const {t} = useTranslation()
  return (
    <>
      <Head><title>{t("title")}</title></Head>
      <header>
        <Navbar color="light" light expand="md">
          <Link href="/">
            <a className="navbar-brand">
              <div className="d-flex flex-row">
                <div className="align-self-center">
                  <img src="/logos/logo-color.svg" alt="logo" height="32" />
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
            </a>
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link href="/new/">
                  <a className="text-primary nav-link"> <FontAwesomeIcon icon={faRocket} className="mr-2" />
                    {t("Start an election")}
                  </a>
                </Link>
              </NavItem>
              <NavItem style={{width: "80px"}}>
                <LanguageSelector />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    </>
  );
}

export default Header;

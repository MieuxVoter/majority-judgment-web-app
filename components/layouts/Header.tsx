/* eslint react/prop-types: 0 */
import { useState } from 'react';
import { Collapse, Navbar, Nav, NavItem, Button } from 'reactstrap';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!isOpen);

  const { t } = useTranslation('resource');

  return (
    <header className="mobile-header">
      <Navbar light className="nav-mobile" expand="lg">
        <div className="navbar-header">
          <Button onClick={toggle} className="navbar-toggle pt-0 mt-0">
            <img src="/open-menu-icon.svg" alt="" height="50" />
          </Button>
        </div>

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto navbar-nav-scroll" navbar>
            <div className="d-flex flex-row justify-content-between nav-logo">
              <Link href="/" className="navbar-brand navbar-brand-mobile">
                <img src="/logos/logo.svg" alt="logo" height="80" />
              </Link>

              <Button
                onClick={toggle}
                className="navbar-toggle navbar-close-button"
              >
                <img height="20" src="/close-menu-icon.svg" alt="logo" />
              </Button>
            </div>
            <div>
              <NavItem>
                <Link
                  href="/"
                  onClick={toggle}
                  className="navbar-my-link nav-link"
                >
                  Le jugement majoritaire
                </Link>
              </NavItem>

              <NavItem>
                <Link
                  href="/"
                  onClick={toggle}
                  className="navbar-my-link nav-link"
                >
                  Qui sommes-nous ?
                </Link>
              </NavItem>

              <NavItem>
                <Link
                  href="/"
                  onClick={toggle}
                  className="navbar-my-link nav-link"
                >
                  Foire aux questions
                </Link>
              </NavItem>

              <NavItem>
                <Link
                  href="/"
                  onClick={toggle}
                  className="navbar-my-link nav-link"
                >
                  On parle de nous
                </Link>
              </NavItem>

              <NavItem>
                <Link
                  href="/"
                  onClick={toggle}
                  className="navbar-my-link nav-link"
                >
                  Nous contactez
                </Link>
              </NavItem>

              <NavItem>
                <LanguageSelector />
              </NavItem>
            </div>

            <NavItem className="navbar-credits-container">
              <Button className="btn-primary btn-nav">
                <a href="/">Soutenez-nous</a>
              </Button>

              <hr />
              <div className="navbar-credits sharing sharing-mobile">
                <p>Partagez l’application Mieux voter</p>
                <Link href="https://www.facebook.com/mieuxvoter.fr/">
                  <img src="/facebook.svg" className="mr-2" />
                </Link>
                <Link href="https://twitter.com/mieux_voter">
                  <img src="/twitter.svg" className="mr-2" />
                </Link>
              </div>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default Header;

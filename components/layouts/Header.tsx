/* eslint react/prop-types: 0 */
import {useState} from 'react';
import {Collapse, Nav, NavItem, Button} from 'reactstrap';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {useAppContext} from '@services/context';
import LanguageSelector from './LanguageSelector';
import openMenuIcon from '../../public/open-menu-icon.svg';

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const {app} = useAppContext();

  const toggle = () => setOpen(!isOpen);

  const {t} = useTranslation('resource');

  if (!app.footer) {return null;}

  return (
    <>
      <Image
        onClick={toggle}
        role="button"
        className="btn_menu d-md-none"
        src={openMenuIcon}
        alt="open menu icon"
        height="50"
        width="50"
      />

      <Collapse isOpen={isOpen} navbar>
        <Nav className="navbar-nav-scroll" navbar>
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
              <LanguageSelector selectedSize={24} />
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
                <img src="/facebook.svg" />
              </Link>
              <Link href="https://twitter.com/mieux_voter">
                <img src="/twitter.svg" />
              </Link>
            </div>
          </NavItem>
        </Nav>
      </Collapse>
    </>
  );
};

export default Header;

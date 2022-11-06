/* eslint react/prop-types: 0 */
import { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import LanguageSelector from './LanguageSelector';
import logoColor from '../public/logos/logo-color.svg';

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!isOpen);

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <header>
        <Navbar color="light" light expand="md">
          <Link href="/" className="navbar-brand">
            <div className="d-flex flex-row">
              <div className="align-self-center">
                <Image src={logoColor} alt="logo" height="32" />
              </div>
              <div className="align-self-center">
                <div className="logo-text">
                  <h1>
                    {t('Voting platform')}
                    <small>{t('Majority Judgment')}</small>
                  </h1>
                </div>
              </div>
            </div>
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <Link href="/new/" className="text-primary nav-link">
                  {' '}
                  <FontAwesomeIcon icon={faRocket} />
                  {t('Start an election')}
                </Link>
              </NavItem>
              <NavItem style={{ width: '80px' }}>
                <LanguageSelector />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    </>
  );
};

export default Header;

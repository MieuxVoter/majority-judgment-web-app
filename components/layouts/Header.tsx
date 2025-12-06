/* eslint react/prop-types: 0 */
import {useState} from 'react';
import {Collapse, Nav, NavItem, Button} from 'reactstrap';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {useAppContext} from '@services/context';
import LanguageSelector from './LanguageSelector';
import openMenuIcon from '../../public/open-menu-icon.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {
  CONTACT_MAIL,
  MAJORITY_JUDGMENT_LINK,
  NEWS_LINK,
  PAYPAL,
  WHO_WE_ARE_LINK,
} from '@services/constants';
import ShareRow from '@components/Share';
import {getUrl, RouteTypes} from '@services/routes';
import {useRouter} from 'next/router';
import Logo from '@components/Logo';
import {getLocaleShort} from '@services/utils';

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const locale = getLocaleShort(router);
  const {t} = useTranslation();
  const [app, _] = useAppContext();

  const toggle = () => setOpen(!isOpen);

  if (app.fullPage) {
    return null;
  }

  const menu = [
    {
      component: (
        <a
          href={MAJORITY_JUDGMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-my-link nav-link"
        >
          {t('menu.majority-judgment')}
        </a>
      ),
    },
    {
      component: (
        <a
          href={WHO_WE_ARE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-my-link nav-link"
        >
          {t('menu.whoarewe')}
        </a>
      ),
    },
    {
      component: (
        <Link
          href={getUrl(RouteTypes.FAQ, locale)}
          className="navbar-my-link nav-link"
        >
          {t('menu.faq')}
        </Link>
      ),
    },
    {
      component: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={NEWS_LINK}
          className="navbar-my-link nav-link"
        >
          {t('menu.news')}
        </a>
      ),
    },
    {
      component: (
        <a
          href="mailto:app@mieuxvoter.fr?subject=[HELP]"
          className="navbar-my-link nav-link"
        >
          {t('menu.contact-us')}
        </a>
      ),
    },
    {
      component: <LanguageSelector selectedSize={24} />,
    },
  ];

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
          <div className="d-flex flex-column min-vh-100 justify-content-between">
            <div>
              <div className="d-flex flex-row justify-content-between align-items-center nav-logo">
                <Link href="/" className="navbar-brand navbar-brand-mobile">
                  <Image src="/logos/logo.svg" alt="logo" height={80} width={175} />
                </Link>

                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={toggle}
                  size="2x"
                  role="button"
                  className="navbar-toggle navbar-close-button"
                />
              </div>
              <div>
                {menu.map((item, i) => (
                  <NavItem key={i}>{item.component}</NavItem>
                ))}
              </div>

              <hr className="my-3" />
            </div>
            <NavItem className="d-flex w-100 align-items-center flex-column">
              <a href={PAYPAL} target="_blank" rel="noreferrer noopener">
                <Button color="primary" className="text-white">
                  {t('common.support-us')}
                </Button>
              </a>

              <ShareRow />
            </NavItem>
          </div>
        </Nav>
      </Collapse>
    </>
  );
};

export default Header;

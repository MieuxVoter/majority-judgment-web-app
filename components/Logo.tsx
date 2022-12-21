import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {HOME} from '@services/routes';
import logoWithText from '../public/logos/logo.svg';
import logo from '../public/logos/logo-footer.svg';


interface LogoProps {
  title?: boolean;
  [props: string]: any;
}

const Logo = ({title = true, ...props}: LogoProps) => {
  const {t} = useTranslation();
  const src = title ? logoWithText : logo;
  return <a href={HOME} >
    <Image src={src} alt={t('logo.alt')} className="d-block" {...props} />
  </a>;
};

export default Logo;

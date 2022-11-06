import Image from 'next/image';
import logoWithText from '../public/logos/logo.svg';
import logo from '../public/logos/logo-footer.svg';
import { useTranslation } from 'next-i18next';

interface LogoProps {
  title?: boolean;
  [props: string]: any;
}

const Logo = ({ title = true, ...props }: LogoProps) => {
  const { t } = useTranslation();
  const src = title ? logoWithText : logo;
  return <Image src={src} alt={t('logo.alt')} className="d-block" {...props} />;
};

export default Logo;

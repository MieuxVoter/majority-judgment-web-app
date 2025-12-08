import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {getUrl, RouteTypes} from '@services/routes';
import logoWithText from '../public/logos/logo.svg';
import logo from '../public/logos/logo-footer.svg';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';

interface LogoProps {
  title?: boolean;
  src?: string | StaticImageData;
  height?: number | `${number}`;
  width?: number | `${number}`;
}

const Logo = ({title = true, src, ...props}: LogoProps) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);
  const logoSrc = src || (title ? logoWithText : logo);
  return (
    <Link href={getUrl(RouteTypes.HOME, locale).toString()}>
      <Image src={logoSrc} alt={t('logo.alt')} className="d-block" {...props} />
    </Link>
  );
};

export default Logo;

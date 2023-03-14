import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {getUrl, RouteTypes} from '@services/routes';
import logoWithText from '../public/logos/logo.svg';
import logo from '../public/logos/logo-footer.svg';
import {useRouter} from 'next/router';
import {getLocaleShort} from '@services/utils';

interface LogoProps {
  title?: boolean;
  [props: string]: any;
}

const Logo = ({title = true, ...props}: LogoProps) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);
  const src = title ? logoWithText : logo;
  return (
    <Link href={getUrl(RouteTypes.HOME, locale).toString()}>
      <Image src={src} alt={t('logo.alt')} className="d-block" {...props} />
    </Link>
  );
};

export default Logo;

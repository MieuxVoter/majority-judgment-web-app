import Image from 'next/image'
import logoWithText from '../public/logos/logo.svg'
import logo from '../public/logos/logo-footer.svg'
import {useTranslation} from "next-i18next";

export const getStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, [], config)),
  },
});

const Logo = props => {
  const {t} = useTranslation();
  const {title} = props;
  const src = title ? logoWithText : logo;
  return (
    <Image
      src={src}
      alt={t('logo.alt')}
      className="d-block"
      {...props}
    />
  )
};

Logo.defaultProps = {
  title: true
};

export default Logo;

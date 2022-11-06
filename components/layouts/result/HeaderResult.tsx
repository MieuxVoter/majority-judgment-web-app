import React from 'react';
import HeaderDesktopResult from './HeaderDesktopResult';
import HeaderMobileResult from './HeaderMobileResult';
// import { useMediaQuery } from 'react-responsive';

export default function HeaderResult() {
  //   const isMobile = useMediaQuery({ query: '(max-width: 800px)' });
  //
  //   if (isMobile) return <HeaderMobileResult />;
  return <HeaderDesktopResult />;
}

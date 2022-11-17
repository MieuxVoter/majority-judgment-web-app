/**
 * This file contains several utils functions
 */

import {useRouter} from 'next/router';

export const getLocaleShort = (): string => {
  const router = useRouter();

  if (!router.locale) {
    return router.defaultLocale.substring(0, 2).toUpperCase();
  }

  if (router.locale.startsWith("en")) {
    return "GB";
  }

  return router.locale.substring(0, 2).toUpperCase();
}



export const getWindowUrl = (): string => {
  return typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'http://localhost';
}


export const getUrlVote = (electionId: string, token: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/vote/${electionId}/${token}`, origin);
}

export const getUrlResult = (electionId: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/result/${electionId}`, origin);
}

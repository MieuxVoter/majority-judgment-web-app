/**
 * This file contains several utils functions
 */

import {NextRouter} from 'next/router';
import {URL_APP} from './constants';

export const getLocaleShort = (router: NextRouter): string => {
  if (!router.locale) {
    return router.defaultLocale.substring(0, 2);
  }

  return router.locale.substring(0, 2);
};

export const getWindowUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.origin)
    return window.location.origin;
  if (process.env.NODE_ENV === 'development')
    return "http://localhost:3000";
  return URL_APP
};

export const displayRef = (ref: string): string => {
  const cl = ref.replaceAll('-', '');
  if (cl.length !== 10) {
    throw new Error('Unexpected election ref');
  }

  return `${cl.substring(0, 3)}-${cl.substring(3, 6)}-${cl.substring(6)}`;
};

export const isEnded = (date: string): boolean => {
  const dateEnd = new Date(date);
  const now = new Date();
  return +dateEnd < +now;
};

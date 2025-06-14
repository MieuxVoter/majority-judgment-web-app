/**
 * This file contains several utils functions
 */

import {NextRouter} from 'next/router';
import {URL_APP} from './constants';

export const getFormattedDatetime = (locale:string, date:string):string => {
  const d = new Date(date);
  return `${d.toLocaleDateString(locale, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})} ${d.toLocaleTimeString(locale, {hour: '2-digit', minute: '2-digit'})}`;
}

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
  if (!date) return false;
  const dateEnd = new Date(date);
  const now = new Date();
  return +dateEnd < +now;
};

export const showGeneratedUrlsInNewTab = (urls: URL[], locale: string) => {
  if (typeof window !== 'undefined') {
    try {
      const urlStrings = urls.map(url => url.toString());
      window.sessionStorage.setItem('generatedUrls', JSON.stringify(urlStrings));
      window.open(`/${locale}/urls`, '_blank');
    } catch (e) {
      console.error('Failed to use sessionStorage or open new tab', e);
    }
  }
};

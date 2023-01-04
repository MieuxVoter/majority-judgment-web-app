/**
 * This file provides the paths to the pages
 */
import { NextRouter } from 'next/router';
import { getWindowUrl, displayRef, getLocaleShort } from './utils';

export enum RouteTypes {
  ADMIN = 'admin',
  BALLOT = 'ballot',
  CREATE_ELECTION = 'admin/new',
  ENDED_VOTE = 'end',
  FAQ = 'faq',
  HOME = '',
  RESULTS = 'result',
  VOTE = 'vote',
}

export const getUrl = (
  type: RouteTypes,
  router: NextRouter,
  ref?: string,
  token?: string
): URL => {
  const locale = getLocaleShort(router);

  if (ref) {
    if (token) {
      const path = `/${locale}/${type}/${displayRef(ref)}/${token}`;
      return new URL(path, getWindowUrl());
    }
    const path = `/${locale}/${type}/${displayRef(ref)}`;
    return new URL(path, getWindowUrl());
  }
  const path = `/${locale}/${type}`;
  return new URL(path, getWindowUrl());
};

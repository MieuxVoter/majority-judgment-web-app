/**
 * This file provides the paths to the pages
 */
import { NextRouter } from 'next/router';
import { getWindowUrl, displayRef, getLocaleShort } from './utils';

export enum RouteTypes {
  HOME = '',
  CREATE_ELECTION = 'admin/new',
  ADMIN = 'admin',
  BALLOT = 'ballot',
  ENDED_VOTE = 'end',
  VOTE = 'vote',
  RESULTS = 'result',
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
    const path = `/${locale}/${type}/${ref}`;
    return new URL(path, getWindowUrl());
  }
  const path = `/${locale}/${type}`;
  return new URL(path, getWindowUrl());
};

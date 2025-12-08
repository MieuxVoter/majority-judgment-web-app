/**
 * This file provides the paths to the pages
 */
import {getWindowUrl, displayRef} from './utils';

export enum RouteTypes {
  ADMIN = 'admin',
  BALLOT = 'ballot',
  CREATE_ELECTION = 'admin/new',
  ENDED_VOTE = 'end',
  FAQ = 'faq',
  HOME = '',
  RESULTS = 'results',
  VOTE = 'votes',
  RESTRICTED_VOTE = 'errors/restricted',
  UPLOAD_CSV = 'upload-csv',
}

export const getUrl = (
  type: RouteTypes,
  locale: string,
  ref?: string,
  token?: string
): URL => {

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

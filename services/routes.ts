/**
 * This file provides the paths to the pages
 */
import {getWindowUrl} from './utils';


export const CREATE_ELECTION = '/admin/new/';

export const getUrlVote = (electionId: string, token: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/vote/${electionId}/${token}`, origin);
}

export const getUrlResult = (electionId: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/result/${electionId}`, origin);
}

export const getUrlAdmin = (electionId: string, adminToken: string): URL => {
  const origin = getWindowUrl();
  return new URL(`/admin/${electionId}?t=${adminToken}`, origin);
}

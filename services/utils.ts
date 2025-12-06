/**
 * This file contains several utils functions
 */

import {NextRouter} from 'next/router';
import {URL_APP} from './constants';
import { MailAndUrlVote, sendInviteMails } from './mail';
import { getUrl, RouteTypes } from './routes';
import { generateQRCodesPDF } from './qrcode';

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

export type Urls = {
  emails:MailAndUrlVote[],
  qrCodes: (URL | string)[],
  manual: (URL | string)[],
}

export type InvitesParam = {
  electionName:string,
  emails:string[]|undefined,
  qrCodeCount:number|undefined,
  urlCount:number|undefined,
  invites:string[],
  ref:string,
  router: NextRouter,
}

export const sendEmailsDownloadQRCodesPDFAndDisplayInvites = async (params:InvitesParam) => {
  const totalInvites = getTotalInvites(params);

  if (totalInvites != params.invites.length) {
    throw new Error('invites count does not match!');
  }
  
  if (totalInvites > 0) {
    const numEmails = params.emails?.length || 0;
    const numQrCodes = params.qrCodeCount || 0;

    const locale = getLocaleShort(params.router);
    const urlVotes = params.invites.map((token: string) =>
      getUrl(RouteTypes.VOTE, locale, params.ref, token)
    );
    const urlResult = getUrl(
      RouteTypes.RESULTS,
      locale,
      params.ref,
    );

    const emailVoteUrls = urlVotes.slice(0, numEmails);  
    const qrCodeVoteUrls = urlVotes.slice(numEmails, numEmails + numQrCodes);  
    const manualVoteUrls = urlVotes.slice(numEmails + numQrCodes);  

    const urls:Urls = {
      emails:[],
      qrCodes: qrCodeVoteUrls.slice(),
      manual: manualVoteUrls.slice(),
    }

    emailVoteUrls.map((e, index)=> {
      urls.emails.push({
        urlVote: e,
        mail: params.emails[index] || '',
      });
    });

    if (qrCodeVoteUrls.length > 0) {
      await generateQRCodesPDF(qrCodeVoteUrls);
    }

    if (emailVoteUrls.length > 0)
      await sendInviteMails(
        urls.emails,
        params.electionName,
        urlResult,
        params.router
      );

    showGeneratedUrlsInNewTab(urls, params.router.locale);
  }
};

export const showGeneratedUrlsInNewTab = (urls: Urls, locale: string) => {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem('generatedUrls', JSON.stringify(urls));
      window.open(`/${locale}/urls`, '_blank');
    } catch (e) {
      console.error('Failed to use sessionStorage or open new tab', e);
    }
  }
};

export type TotalInvitesParam = {
  emails?:string[]|undefined,
  qrCodeCount?:number|undefined,
  urlCount?:number|undefined,
}

export const getTotalInvites = (election: TotalInvitesParam): number => {
  if (!election) return 0;
  return (
    (election.emails?.length || 0) +
    (election.qrCodeCount || 0) +
    (election.urlCount || 0)
  );
};
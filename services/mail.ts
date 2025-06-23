import {NextRouter} from 'next/router';
import {getLocaleShort} from './utils';
import {availableLanguages} from '@functions/i18next';

export type MailAndUrlVote = {mail:string, urlVote:string | URL};

export const sendInviteMails = async (
  mailAndUrlVotes: Array<MailAndUrlVote>,
  name: string,
  urlResult: string | URL,
  router: NextRouter
) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  if (!mailAndUrlVotes.length) {
    throw new Error('No emails are provided.');
  }

  const recipients = {};
  mailAndUrlVotes.forEach((e) => {
    recipients[e.mail] = {
      urlVote: e.urlVote,
      urlResult: urlResult,
      title: name,
    };
  });

  const locale = getLocaleShort(router);  

  if (!availableLanguages.includes(locale)) {
    throw new Error(`{locale} is not available for mails`);
  }

  const req = await fetch('/.netlify/functions/send-emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'invite',
      question: name,
      recipients,
      locale,
    }),
  });

  return req;
};

export const sendAdminMail = async (
  mail: string,
  name: string,
  locale: string,
  urlAdmin: URL
) => {
  /**
   * Send a reminder to admink panel
   */
  if (!mail || !validateMail(mail)) {
    throw new Error('Incorrect format for the email');
  }

  const req = await fetch('/.netlify/functions/send-emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'admin',
      locale,
      question: name,
      recipients: {
        [mail]: {
          urlAdmin,
          title: name,
        },
      },
    }),
  });

  return req;
};

export const validateMail = (email: string) => {
  // https://stackoverflow.com/a/46181/4986615
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

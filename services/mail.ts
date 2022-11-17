import {getLocaleShort} from './utils';

export const sendInviteMails = async (
  mails: Array<string>,
  tokens: Array<string>,
  name: string,
  urlVote: string | URL,
  urlResult: string | URL,

) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  if (!mails || !mails.length) {
    throw new Error('No emails are provided.');
  }

  if (mails.length !== tokens.length) {
    throw new Error('The number of emails differ from the number of tokens');
  }

  const recipientVariables = {};
  tokens.forEach((token, index) => {
    recipientVariables[mails[index]] = {
      urlVote: urlVote,
      urlResult: urlResult,
    };
  });

  const locale = getLocaleShort();

  const req = await fetch('/.netlify/functions/send-invite-email/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipientVariables,
      name,
      locale,
    }),
  });

  return req;
};



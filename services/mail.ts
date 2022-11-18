import {getLocaleShort} from './utils';

export const sendInviteMails = async (
  mails: Array<string>,
  name: string,
  urlVotes: Array<string | URL>,
  urlResult: string | URL,

) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  if (!mails || !mails.length) {
    throw new Error('No emails are provided.');
  }

  if (mails.length !== urlVotes.length) {
    throw new Error('The number of emails differ from the number of tokens');
  }

  const recipientVariables = {};
  mails.forEach((_, index: number) => {
    recipientVariables[mails[index]] = {
      urlVote: urlVotes[index],
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


export const sendAdminMail = async (
  mail: string,
  adminUrl: URL,
) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  if (!mail || !validateMail(mail)) {
    throw new Error('Incorrect format for the email');
  }

  const req = await fetch('/.netlify/functions/send-admin-email/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mail,
      adminUrl,
    }),
  });

  return req;

}

export const validateMail = (email: string) => {
  // https://stackoverflow.com/a/46181/4986615
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

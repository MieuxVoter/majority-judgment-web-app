const api = {
  urlServer:
    process.env.NEXT_PUBLIC_SERVER_URL || 'https://demo.mieuxvoter.fr/api/',
  feedbackForm:
    process.env.NEXT_PUBLIC_FEEDBACK_FORM ||
    'https://docs.google.com/forms/d/e/1FAIpQLScuTsYeBXOSJAGSE_AFraFV7T2arEYua7UCM4NRBSCQQfRB6A/viewform',
  routesServer: {
    setElection: 'election/',
    getElection: 'election/get/:slug/',
    getResults: 'election/results/:slug',
    voteElection: 'election/vote/',
  },
};

const sendInviteMail = (res) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  const { id, title, mails, tokens, locale } = res;

  if (!mails || !mails.length) {
    throw new Error('No emails are provided.');
  }

  if (mails.length !== tokens.length) {
    throw new Error('The number of emails differ from the number of tokens');
  }

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'http://localhost';
  const urlVote = (pid, token) => new URL(`/vote/${pid}/${token}`, origin);
  const urlResult = (pid) => new URL(`/result/${pid}`, origin);

  const recipientVariables = {};
  tokens.forEach((token, index) => {
    recipientVariables[mails[index]] = {
      urlVote: urlVote(id, token),
      urlResult: urlResult(id),
    };
  });

  const req = fetch('/.netlify/functions/send-invite-email/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipientVariables,
      title,
      locale,
    }),
  });

  return req.then((any) => res);
};

const createElection = (
  title: string,
  candidates: Array<string>,
  description?: string,
  mails?: Array<string>,
  numGrades?: number,
  finish?: string,
  restrictResult?: boolean,
  locale?: string,
  successCallback = null,
  failureCallback = null
) => {
  /**
   * Create an election from its title, its candidates and a bunch of options
   */
  const endpoint = new URL(api.routesServer.setElection, api.urlServer);

  console.log(endpoint.href);
  const onInvitationOnly = mails && mails.length > 0;

  fetch(endpoint.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      candidates,
      on_invitation_only: onInvitationOnly,
      num_grades: numGrades,
      elector_emails: mails || [],
      // start_at: start,
      finish_at: finish,
      select_language: locale || 'en',
      front_url: window.location.origin,
      restrict_results: restrictResult,
      send_mail: false,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((res) => {
      if (onInvitationOnly) {
        return sendInviteMail({ locale, mails: mails, ...res });
      }
      return res;
    })
    .then(successCallback)
    .catch(failureCallback || console.log);
};

const getResults = (
  pid: string,
  successCallback = null,
  failureCallback = null
) => {
  /**
   * Fetch results from external API
   */

  const endpoint = new URL(
    api.routesServer.getResults.replace(new RegExp(':slug', 'g'), pid),
    api.urlServer
  );

  return fetch(endpoint.href)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response.text());
      }
      return response.json();
    })
    .then(successCallback || ((res) => res))
    .catch(failureCallback || ((err) => err));
};

const getDetails = (
  pid: string,
  successCallback = null,
  failureCallback = null
) => {
  /**
   * Fetch data from external API
   */

  const detailsEndpoint = new URL(
    api.routesServer.getElection.replace(new RegExp(':slug', 'g'), pid),
    api.urlServer
  );
  return fetch(detailsEndpoint.href)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response.text());
      }
      return response.json();
    })
    .then(successCallback || ((res) => res))
    .catch(failureCallback || ((err) => err))
    .then((res) => res);
};

const castBallot = (
  judgments: Array<number>,
  pid: string,
  token: string,
  callbackSuccess = null,
  callbackError = null
) => {
  /**
   * Save a ballot on the remote database
   */

  const endpoint = new URL(api.routesServer.voteElection, api.urlServer);

  const payload = {
    election: pid,
    grades_by_candidate: judgments,
  };
  if (token && token !== '') {
    payload['token'] = token;
  }

  fetch(endpoint.href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(callbackSuccess || ((res) => res))
    .catch(callbackError || console.log);
};

export const UNKNOWN_ELECTION_ERROR = 'E1:';
export const ONGOING_ELECTION_ERROR = 'E2:';
export const NO_VOTE_ERROR = 'E3:';
export const ELECTION_NOT_STARTED_ERROR = 'E4:';
export const ELECTION_FINISHED_ERROR = 'E5:';
export const INVITATION_ONLY_ERROR = 'E6:';
export const UNKNOWN_TOKEN_ERROR = 'E7:';
export const USED_TOKEN_ERROR = 'E8:';
export const WRONG_ELECTION_ERROR = 'E9:';
export const API_ERRORS = [
  UNKNOWN_TOKEN_ERROR,
  ONGOING_ELECTION_ERROR,
  NO_VOTE_ERROR,
  ELECTION_NOT_STARTED_ERROR,
  ELECTION_FINISHED_ERROR,
  INVITATION_ONLY_ERROR,
  UNKNOWN_TOKEN_ERROR,
  USED_TOKEN_ERROR,
  WRONG_ELECTION_ERROR,
];

export const apiErrors = (error: string): string => {
  const errorCode = `${error.split(':')[0]}:`;

  if (API_ERRORS.includes(errorCode)) {
    return `error.${error.split(':')[0].toLowerCase()}`;
  } else {
    return 'error.catch22';
  }
};

export {
  api,
  getDetails,
  getResults,
  createElection,
  sendInviteMail,
  castBallot,
};

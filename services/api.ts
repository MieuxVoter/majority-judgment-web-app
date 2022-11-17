import {Candidate, Grade} from './type';

export const api = {
  urlServer:
    process.env.NEXT_PUBLIC_SERVER_URL || 'https://apiv2.mieuxvoter.fr/',
  feedbackForm:
    process.env.NEXT_PUBLIC_FEEDBACK_FORM ||
    'https://docs.google.com/forms/d/e/1FAIpQLScuTsYeBXOSJAGSE_AFraFV7T2arEYua7UCM4NRBSCQQfRB6A/viewform',
  routesServer: {
    setElection: 'elections',
    getElection: 'elections/:slug',
    getResults: 'results/:slug',
    voteElection: 'votes',
  },
};


export const createElection = async (
  name: string,
  candidates: Array<Candidate>,
  grades: Array<Grade>,
  description: string = "",
  numVoters: number = 0,
  hideResults: boolean = true,
  forceClose: boolean = false,
  restricted: boolean = false,
  successCallback = null,
  failureCallback = console.log
) => {
  /**
   * Create an election from its title, its candidates and a bunch of options
   */
  const endpoint = new URL(api.routesServer.setElection, api.urlServer);

  if (!restricted && numVoters > 0) {
    throw Error("Set the election as not private!");
  }

  const req = await fetch(endpoint.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      candidates: candidates,
      grades: grades,
      hide_results: hideResults,
      force_close: forceClose,
      private: restricted,
    }),
  })

  if (!req.ok) {
    if (successCallback) {
      const payload = await req.json();
      successCallback(payload);
    }
  } else if (failureCallback) {
    failureCallback(req.statusText)
  }
};


export const getResults = (
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


export const getElectionDetails = (
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


export const castBallot = (
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
    headers: {'Content-Type': 'application/json'},
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


export interface GradePayload {
  name: string;
  description: string;
  id: number;
  value: number;
}


export interface CandidatePayload {
  name: string;
  description: string;
  id: number;
  image: string;
}


export interface ElectionPayload {
  name: string;
  description: string;
  ref: string;
  date_create: string;
  date_modified: string;
  num_voters: number;
  date_start: string;
  date_end: string;
  hide_results: boolean;
  force_close: boolean;
  private: boolean;
  id: number;
  grades: Array<GradePayload>;
  candidates: Array<CandidatePayload>;
  tokens: Array<string>;
  admin: string;
}

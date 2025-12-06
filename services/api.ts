import { Candidate, Grade, Vote } from './type';
import { URL_SERVER } from './constants';
import { ElectionContextInterface } from './ElectionContext';

export const api = {
  routesServer: {
    setElection: 'elections',
    getElection: 'elections/:slug',
    getResults: 'results/:slug',
    getProgress: 'elections/:slug/progress',
    voteElection: 'ballots',
  },
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

export interface ErrorMessage {
  loc: Array<string>;
  msg: string;
  type: string;
  ctx: any;
}

export interface ErrorPayload {
  error: string;   // e.g., "ELECTION_FINISHED"
  message: string; // e.g., "The election has finished."
}

export interface ElectionPayload {
  name: string;
  status?: number;
  description: string;
  ref: string;
  date_start: string;
  date_end: string;
  hide_results: boolean;
  force_close: boolean;
  restricted: boolean;
  grades: Array<GradePayload>;
  candidates: Array<CandidatePayload>;
  auth_for_result:boolean;
}

export interface ProgressPayload {
  num_voters: number;
  num_voters_voted: number;
}

export interface ElectionCreatedPayload extends ElectionPayload {
  invites: Array<string>;
  admin: string;
  num_voters: number;
}

export interface ElectionUpdatedPayload extends ElectionPayload {
  invites: Array<string>;
  num_voters: number;
}

export interface ResultsPayload extends ElectionPayload {
  status: number;
  ranking: { [key: string]: number };
  merit_profile: { [key: number]: Array<number> };
}

export interface VotePayload {
  id: string;
  candidate: CandidatePayload;
  grade: GradePayload;
}

export interface BallotPayload {
  votes: Array<VotePayload>;
  election: ElectionPayload;
  token: string;
}

export const createElection = async (
  name: string,
  candidates: Array<Candidate>,
  grades: Array<Grade>,
  description: string,
  numVoters: number,
  hideResults: boolean,
  forceClose: boolean,
  restricted: boolean,
  randomOrder: boolean,
  dateEnd: string,
  dateStart: string,
  authForResult: boolean,
  successCallback: ((payload: unknown) => void) | null = null,
  failureCallback: ((error: unknown) => void) = console.log
) => {
  /**
   * Create an election from its title, its candidates and a bunch of options
   */
  const endpoint = new URL(api.routesServer.setElection, URL_SERVER);

  if (!restricted && numVoters > 0) {
    throw new Error('Set the election as not restricted!');
  }

  try {
    const req = await fetch(endpoint.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: JSON.stringify({
          description: description,
          randomOrder: randomOrder,
        }),
        candidates,
        grades,
        num_voters: numVoters,
        hide_results: hideResults,
        force_close: forceClose,
        date_end: dateEnd,
        date_start: dateStart,
        restricted,
        auth_for_result: authForResult,
      }),
    });
    if (req.ok && req.status === 200) {
      if (successCallback) {
        const payload = await req.json();
        successCallback(payload);
        return payload;
      }
    } else if (failureCallback) {
      try {
        const payload = await req.json();
        failureCallback(payload);
      } catch (e) {
        failureCallback(req.statusText);
      }
    }
  } catch (e) {
    return failureCallback && failureCallback(e);
  }
};

export const updateElection = async (
  ref: string,
  name: string,
  candidates: Array<Candidate>,
  grades: Array<Grade>,
  description: string,
  dateEnd: string,
  dateStart: string,
  numVoters: number,
  hideResults: boolean,
  forceClose: boolean,
  restricted: boolean,
  randomOrder: boolean,
  authForResult:boolean,
  token: string,
): Promise<ElectionUpdatedPayload | ErrorPayload> => {
  /**
   * Create an election from its title, its candidates and a bunch of options
   */
  const endpoint = new URL(api.routesServer.setElection, URL_SERVER);

  try {
    const req = await fetch(endpoint.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ref,
        name,
        description: JSON.stringify({
          description: description,
          randomOrder: randomOrder,
        }),
        candidates,
        grades,
        num_voters: numVoters,
        hide_results: hideResults,
        force_close: forceClose,
        date_end: dateEnd,
        date_start: dateStart,
        auth_for_result: authForResult,
        restricted,
      }),
    });
    if (!req.ok || req.status !== 200) {
      const payload = await req.json();
      return { status: req.status, ...payload };
    }
    const payload = await req.json();
    return { status: 200, ...payload };
  } catch (e) {
    console.error(e);
    return { error: 'CLIENT_ERROR', message: `Unknown API error: ${e}` };
  }
};

export const closeElection = async (
  ref: string,
  token: string
): Promise<ElectionUpdatedPayload | ErrorPayload> => {
  const endpoint = new URL(api.routesServer.setElection, URL_SERVER);

  try {
    const req = await fetch(endpoint.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ref,
        force_close: true,
      }),
    });
    if (!req.ok || req.status !== 200) {
      const payload = await req.json();
      return { status: req.status, ...payload };
    }
    const payload = await req.json();
    return { status: 200, ...payload };
  } catch (e) {
    console.error(e);
    return { error: 'CLIENT_ERROR', message: `Unknown API error: ${e}` };
  }
};

export const openElection = async (
  election: ElectionContextInterface,
  token: string
): Promise<ElectionUpdatedPayload | ErrorPayload> => {
  const endpoint = new URL(api.routesServer.setElection, URL_SERVER);

  try {
    const params = {
      ref:election.ref,
      force_close: false,
      date_end: null
    };

    if (election.dateEnd != null) {
      const dateEnd = new Date(election.dateEnd);

      if (dateEnd.getTime() <= Date.now()){
        dateEnd.setDate(dateEnd.getDate()+1);
        params.date_end = dateEnd.toISOString();
      }
    }

    const req = await fetch(endpoint.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    if (!req.ok || req.status !== 200) {
      const payload = await req.json();
      return { status: req.status, ...payload };
    }
    const payload = await req.json();
    return { status: 200, ...payload };
  } catch (e) {
    console.error(e);
    return { error: 'CLIENT_ERROR', message: `Unknown API error: ${e}` };
  }
};

/**
 * Fetch results from external API
 */
export const getResults = async (
  pid: string, token:string|null = null
): Promise<ResultsPayload | ErrorPayload> => {
  const endpoint = new URL(
    api.routesServer.getResults.replace(new RegExp(':slug', 'g'), pid),
    URL_SERVER
  );

  try {
    const response = token == null ? await fetch(endpoint.href) : await fetch(endpoint.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.status != 200) {
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { error: 'CLIENT_ERROR', message: `Unknown API error: ${error}` };
  }
};

export const getElection = async (
  pid: string
): Promise<ElectionPayload | ErrorPayload> => {
  /**
   * Fetch data from external API
   */
  const path = api.routesServer.getElection.replace(
    new RegExp(':slug', 'g'),
    pid
  );
  const endpoint = new URL(path, URL_SERVER);

  try {
    const response = await fetch(endpoint.href);

    if (response.status != 200) {
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    return { error: 'CLIENT_ERROR', message: 'Unknown API error' };
  }
};

export const getProgress = async (
  pid: string,
  token: string
): Promise<ProgressPayload | ErrorPayload> => {
  /**
   * Fetch progress (number of voters) from external API
   */
  const path = api.routesServer.getProgress.replace(
    new RegExp(':slug', 'g'),
    pid
  );
  const endpoint = new URL(path, URL_SERVER);

  try {
    const response = await fetch(endpoint.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status != 200) {
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    return { error: 'CLIENT_ERROR', message: 'Unknown API error' };
  }
};

/**
 * Fetch a ballot from the API. Return null if the ballot does not exist.
 */
export const getBallot = async (
  token: string
): Promise<ElectionPayload | ErrorPayload> => {
  const path = api.routesServer.voteElection;
  const endpoint = new URL(path, URL_SERVER);

  if (!token) {
    throw new Error('Missing token');
  }

  try {
    const response = await fetch(endpoint.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status != 200) {
      return await response.json();
    }

    return await response.json();
  } catch (error) {
    return { error: 'CLIENT_ERROR', message: 'Unknown API error' };
  }
};

export const castBallot = (
  votes: Array<Vote>,
  election: ElectionPayload,
  token?: string
) => {
  /**
   * Save a ballot on the remote database
   */

  const endpoint = new URL(api.routesServer.voteElection, URL_SERVER);

  const payload = {
    election_ref: election.ref,
    votes: votes.map((v) => ({
      candidate_id: election.candidates[v.candidateId].id,
      grade_id: election.grades[v.gradeId].id,
    })),
  };

  if (!election.restricted) {
    return fetch(endpoint.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } else {
    if (!token) {
      throw new Error('Missing token');
    }
    return fetch(endpoint.href, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  }
};

export const BAD_REQUEST_ERROR_CODE = 'BAD_REQUEST';
export const ELECTION_FINISHED_ERROR_CODE = 'ELECTION_FINISHED';
export const ELECTION_IS_ACTIVE_ERROR_CODE = 'ELECTION_IS_ACTIVE';
export const ELECTION_NOT_STARTED_ERROR_CODE = 'ELECTION_NOT_STARTED';
export const ELECTION_RESTRICTED_ERROR_CODE = 'ELECTION_RESTRICTED';
export const FORBIDDEN_ERROR_CODE = 'FORBIDDEN';
export const IMMUTABLE_IDS_ERROR_CODE = 'IMMUTABLE_IDS';
export const INCONSISTENT_BALLOT_ERROR_CODE = 'INCONSISTENT_BALLOT';
export const INVALID_DATE_CONFIGURATION_ERROR_CODE = 'INVALID_DATE_CONFIGURATION';
export const NO_RECORDED_VOTES_ERROR_CODE = 'NO_RECORDED_VOTES';
export const NOT_FOUND_ERROR_CODE = 'NOT_FOUND';
export const RESULTS_HIDDEN_ERROR_CODE = 'RESULTS_HIDDEN';
export const SCHEMA_VALIDATION_ERROR_CODE = 'SCHEMA_VALIDATION_ERROR';
export const UNAUTHORIZED_ERROR_CODE = 'UNAUTHORIZED';
export const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';
export const WRONG_ELECTION_ERROR_CODE = 'WRONG_ELECTION';

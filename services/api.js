const api = {
  urlServer:
    process.env.NEXT_PUBLIC_SERVER_URL || "https://demo.mieuxvoter.fr/api/",
  feedbackForm:
    process.env.NEXT_PUBLIC_FEEDBACK_FORM ||
    "https://docs.google.com/forms/d/e/1FAIpQLScuTsYeBXOSJAGSE_AFraFV7T2arEYua7UCM4NRBSCQQfRB6A/viewform",
  routesServer: {
    setElection: "election/",
    getElection: "election/get/:slug/",
    getResults: "election/results/:slug",
    voteElection: "election/vote/",
  },
};

const sendInviteMail = (res) => {
  /**
   * Send an invitation mail using a micro-service with Netlify
   */
  const { title, mails, tokens, locale } = res;

  if (mails.length !== tokens.length) {
    throw new Error("The number of emails differ from the number of tokens");
  }

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost";
  const urlVote = (pid) => new URL(`/vote/${pid}`, origin);
  const urlResult = (pid) => new URL(`/result/${pid}`, origin);

  const recipientVariables = {};
  tokens.forEach((token, index) => {
    recipientVariables[mails[index]] = {
      urlVote: urlVote(token),
      urlResult: urlResult(token),
    };
  });

  const req = fetch("/.netlify/functions/send-invite-email/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientVariables,
      title,
      locale,
    }),
  });

  return Promise.all([
    new Promise((resolve, reject) => {
      resolve(res);
    }),
    req,
  ]);
};

const createElection = (
  title,
  candidates,
  {
    /**
     * Create an election from its title, its candidates and a bunch of options
     */
    emails,
    numGrades,
    start,
    finish,
    restrictResult,
    locale,
  },
  successCallback,
  failureCallback
) => {
  const endpoint = new URL(api.routesServer.setElection, api.urlServer);

  console.log(endpoint.href);

  fetch(endpoint.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      candidates,
      on_invitation_only: emails.length > 0,
      num_grades: numGrades,
      elector_emails: emails || [],
      start_at: start,
      finish_at: finish,
      select_language: locale || "en",
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
    .then((res) => sendInviteMail({ locale, mails: emails || [], ...res }))
    .then((res) => res[0]) // remove response from mail invitations
    .then(successCallback)
    .catch(failureCallback || console.log);
};

const getResults = (pid, successCallback, failureCallback) => {
  /**
   * Fetch results from external API
   */

  const endpoint = new URL(
    api.routesServer.getResults.replace(new RegExp(":slug", "g"), pid),
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

const getDetails = (pid, successCallback, failureCallback) => {
  /**
   * Fetch data from external API
   */

  const detailsEndpoint = new URL(
    api.routesServer.getElection.replace(new RegExp(":slug", "g"), pid),
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
    .catch(failureCallback || ((err) => err));
};

const castBallot = (judgments, pid, token, callbackSuccess, callbackError) => {
  /**
   * Save a ballot on the remote database
   */

  const endpoint = new URL(api.routesServer.voteElection, api.urlServer);

  const payload = {
    election: pid,
    grades_by_candidate: judgments,
  };
  if (token && token !== "") {
    payload["token"] = token;
  }

  fetch(endpoint.href, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(callbackSuccess || ((res) => res))
    .catch(callbackError || console.log);
};

export const UNKNOWN_ELECTION_ERROR = "E1:";
export const ONGOING_ELECTION_ERROR = "E2:";
export const NO_VOTE_ERROR = "E3:";
export const ELECTION_NOT_STARTED_ERROR = "E4:";
export const ELECTION_FINISHED_ERROR = "E5:";
export const INVITATION_ONLY_ERROR = "E6:";
export const UNKNOWN_TOKEN_ERROR = "E7:";
export const USED_TOKEN_ERROR = "E8:";
export const WRONG_ELECTION_ERROR = "E9:";

export const apiErrors = (error, t) => {
  if (error.includes(UNKNOWN_ELECTION_ERROR)) {
    return t("Oops... The election is unknown.");
  }
  if (error.includes(ONGOING_ELECTION_ERROR)) {
    return t(
      "The election is still going on. You can't access now to the results."
    );
  }
  if (error.includes(NO_VOTE_ERROR)) {
    return t("No votes have been recorded yet. Come back later.");
  }
  if (error.includes(ELECTION_NOT_STARTED_ERROR)) {
    return t("The election has not started yet.");
  }
  if (error.includes(ELECTION_FINISHED_ERROR)) {
    return t("The election is over. You can't vote anymore");
  }
  if (error.includes(INVITATION_ONLY_ERROR)) {
    return t("You need a token to vote in this election");
  }
  if (error.includes(USED_TOKEN_ERROR)) {
    return t("You seem to have already voted.");
  }
  if (error.includes(WRONG_ELECTION_ERROR)) {
    return t("The parameters of the election are incorrect.");
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

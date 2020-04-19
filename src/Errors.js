import React from "react";
import { Container, Row, Col } from "reactstrap";

export const UNKNOWN_ELECTION_ERROR = "E1";
export const ONGOING_ELECTION_ERROR = "E2";
export const NO_VOTE_ERROR = "E3";
export const ELECTION_NOT_STARTED_ERROR = "E4";
export const ELECTION_FINISHED_ERROR = "E5";
export const INVITATION_ONLY_ERROR = "E6";
export const UNKNOWN_TOKEN_ERROR = "E7";
export const USED_TOKEN_ERROR = "E8";
export const WRONG_ELECTION_ERROR = "E9";

export const redirectError = (errorMsg, history) => {};

export const errorMessage = (error, t) => {
  if (error.startsWith(UNKNOWN_ELECTION_ERROR)) {
    return t("Oops... The election is unknown.");
  } else if (error.startsWith(ONGOING_ELECTION_ERROR)) {
    return t(
      "The election is still going on. You can't access now to the results."
    );
  } else if (error.startsWith(NO_VOTE_ERROR)) {
    return t("No votes have been recorded yet. Come back later.");
  } else if (error.startsWith(ELECTION_NOT_STARTED_ERROR)) {
    return t("The election has not started yet.");
  } else if (error.startsWith(ELECTION_FINISHED_ERROR)) {
    return t("The election is over. You can't vote anymore");
  } else if (error.startsWith(INVITATION_ONLY_ERROR)) {
    return t("You need a token to vote in this election");
  } else if (error.startsWith(USED_TOKEN_ERROR)) {
    return t("You seem to have already voted.");
  } else if (error.startsWith(WRONG_ELECTION_ERROR)) {
    return t("The parameters of the election are incorrect.");
  }
};

export const Error = props => (
  <Container>
    <Row>
      <Col xs="12">
        <h1>{props.value}</h1>
      </Col>
    </Row>
  </Container>
);

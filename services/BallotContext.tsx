/**
 * This file provides a context and a reducer to manage a ballot
 */
import {createContext, useContext, useReducer, Dispatch} from 'react';
import {ElectionPayload} from './api';


export interface Vote {
  candidateId: number;
  gradeId: number;
}

export interface BallotContextInterface {
  election: ElectionPayload | null;
  votes: Array<Vote>;
}

const defaultBallot: BallotContextInterface = {
  election: null,
  votes: []
};


export enum BallotTypes {
  ELECTION = 'ELECTION',
  VOTE = 'VOTE',
}

export type ElectionAction = {
  type: BallotTypes.ELECTION;
  election: ElectionPayload;
}

export type VoteAction = {
  type: BallotTypes.VOTE;
  candidateId: number;
  gradeId: number;
}

export type BallotActionTypes = ElectionAction | VoteAction;


function reducer(ballot: BallotContextInterface, action: BallotActionTypes) {
  /**
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case BallotTypes.ELECTION: {
      return {...ballot, election: action.election}
    }
    case BallotTypes.VOTE: {
      const votes = [...ballot.votes];
      const voteForCandidate = votes.filter(v => v.candidateId === action.candidateId);
      if (voteForCandidate.length > 1) {
        throw Error("Inconsistent ballot")
      }
      if (voteForCandidate.length === 1) {
        voteForCandidate[0].candidateId = action.candidateId;
        voteForCandidate[0].gradeId = action.gradeId;
      } else {
        votes.push({
          candidateId: action.candidateId,
          gradeId: action.gradeId,
        })
      }
      return {...ballot, votes};
    }
    default: {
      return ballot
    }
  }
}

type DispatchType = Dispatch<BallotActionTypes>;
const BallotContext = createContext<[BallotContextInterface, DispatchType]>([defaultBallot, () => {}]);
// const BallotContext = createContext([defaultBallot, () => {}]);

export function BallotProvider({children}) {
  /**
   * Provide the election and the dispatch to all children components
   */
  const [ballot, dispatch] = useReducer(reducer, defaultBallot);

  return (
    <BallotContext.Provider value={[ballot, dispatch]}>
      {children}
    </BallotContext.Provider>
  );
}

export function useBallot() {
  /**
   * A simple hook to manage ballots
   */
  return useContext(BallotContext);
}


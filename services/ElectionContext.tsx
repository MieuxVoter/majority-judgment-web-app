/**
 * This file provides a context and a reducer to manage an election
 */
import {createContext, useContext, useReducer, useEffect, Dispatch, SetStateAction} from 'react';
import {useRouter} from 'next/router';
import {CandidateItem, GradeItem} from './type';

export interface ElectionContextInterface {
  name: string;
  description: string;
  candidates: Array<CandidateItem>;
  grades: Array<GradeItem>;
  hideResults: boolean;
  forceClose: boolean;
  restricted: boolean;
  randomOrder: boolean;
  endVote: string;
  emails: Array<string>;
}

const defaultCandidate: CandidateItem = {
  name: '',
  image: '',
  description: '',
  active: false,
};

const defaultElection: ElectionContextInterface = {
  name: '',
  description: '',
  candidates: [{...defaultCandidate}, {...defaultCandidate}],
  grades: [],
  randomOrder: true,
  hideResults: true,
  forceClose: false,
  restricted: false,
  endVote: null,
  emails: [],
};

type DispatchType = Dispatch<SetStateAction<ElectionContextInterface>>;

// Store data about an election
const ElectionContext = createContext<ElectionContextInterface>(defaultElection);
// Store the dispatch function that can modify an election
// const ElectionDispatchContext = createContext<DispatchType | null>(null);
const ElectionDispatchContext = createContext(null);

export function ElectionProvider({children}) {
  /**
   * Provide the election and the dispatch to all children components
   */
  const [election, dispatch] = useReducer(electionReducer, defaultElection);

  // At the initialization, set the name using GET param
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    dispatch({
      type: 'set',
      field: 'name',
      value: router.query.name || '',
    });
  }, [router.isReady]);

  return (
    <ElectionContext.Provider value={election}>
      <ElectionDispatchContext.Provider value={dispatch}>
        {children}
      </ElectionDispatchContext.Provider>
    </ElectionContext.Provider>
  );
}

export function useElection() {
  /**
   * A simple hook to read the election
   */
  return useContext(ElectionContext);
}

export function useElectionDispatch() {
  /**
   * A simple hook to modify the election
   */
  return useContext(ElectionDispatchContext);
}

function electionReducer(election: ElectionContextInterface, action) {
  /**
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case 'set': {
      return {...election, [action.field]: action.value};
    }
    case 'commit': {
      throw Error('Not implemented yet');
    }
    case 'remove': {
      throw Error('Not implemented yet');
    }
    case 'candidate-push': {
      const candidate =
        action.value === 'default' ? {...defaultCandidate} : action.value;
      const candidates = [...election.candidates, candidate];
      console.log("NONACTIVE", candidates.filter(c => !c.active).length)
      if (candidates.filter(c => !c.active).length === 0) {
        return {
          ...election, candidates: [...candidates, {...defaultCandidate}]
        };
      }
      else {
        return {...election, candidates};
      }
    }
    case 'candidate-rm': {
      if (typeof action.position !== 'number') {
        throw Error(`Unexpected candidate position ${action.position}`);
      }
      const candidates = [...election.candidates];
      candidates.splice(action.position, 1);
      return {...election, candidates};
    }
    case 'candidate-set': {
      if (typeof action.position !== 'number') {
        throw Error(`Unexpected candidate position ${action.value}`);
      }
      if (action.field === 'active') {
        throw Error('You are not allowed the set the active flag');
      }
      const candidates = [...election.candidates];
      const candidate = candidates[action.position];
      candidate[action.field] = action.value;
      candidate['active'] = true;
      if (candidates.filter(c => !c.active).length === 0) {
        return {
          ...election, candidates: [...candidates, {...defaultCandidate}]
        };
      }
      return {...election, candidates};
    }
    case 'grade-push': {
      const grade =
        action.value === 'default' ? {...defaultCandidate} : action.value;
      const grades = [...election.grades, grade];
      return {...election, grades};
    }
    case 'grade-rm': {
      if (typeof action.position !== 'number') {
        throw Error(`Unexpected grade position ${action.position}`);
      }
      const grades = [...election.grades];
      grades.splice(action.position);
      return {...election, grades};
    }
    case 'grade-set': {
      if (typeof action.position !== 'number') {
        throw Error(`Unexpected grade position ${action.position}`);
      }
      const grades = [...election.grades];
      const grade = grades[action.position];
      grade[action.field] = action.value;
      return {...election, grades};
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}


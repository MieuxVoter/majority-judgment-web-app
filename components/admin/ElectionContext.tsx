/**
 * This file provides a context and a reducer to manage an election
 */
import {createContext, useContext, useReducer, useEffect} from 'react';
import {useRouter} from "next/router";
import {DEFAULT_GRADES} from '@services/constants';

// Store data about an election
const ElectionContext = createContext(null);
// Store the dispatch function that can modify an election
const ElectionDispatchContext = createContext(null);



export function ElectionProvider({children}) {
  /**
   * Provide the election and the dispatch to all children components
   */
  const [election, dispatch] = useReducer(
    electionReducer,
    initialElection
  );

  // At the initialization, set the title using GET param
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    dispatch({
      'type': 'set',
      'field': 'title',
      'value': router.query.title || ""
    })
  }, [router.isReady]);


  return (
    <ElectionContext.Provider value={election}>
      <ElectionDispatchContext.Provider
        value={dispatch}
      >
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

function electionReducer(election, action) {
  /** 
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case 'set': {
      return {...election, [action.field]: action.value};
    }
    case 'commit': {
      throw Error('Not implemented yet')
    }
    case 'remove': {
      throw Error('Not implemented yet')
    }
    case 'candidate-push': {
      const candidate = action.value === 'default' ? {...defaultCandidate} : action.value;
      const candidates = [...election.candidates, candidate];
      return {...election, candidates}
    }
    case 'candidate-rm': {
      if (typeof action.position !== "number") {
        throw Error(`Unexpected candidate position ${action.position}`)
      }
      const candidates = [...election.candidates];
      candidates.splice(action.position)
      return {...election, candidates}
    }
    case 'candidate-set': {
      if (typeof action.position !== "number") {
        throw Error(`Unexpected candidate position ${action.value}`)
      }
      if (action.field === "active") {
        throw Error("You are not allowed the set the active flag")
      }
      const candidates = [...election.candidates];
      const candidate = candidates[action.position]
      candidate[action.field] = action.value
      candidate['active'] = true;
      return {...election, candidates}
    }
    case 'grade-push': {
      const grade = action.value === 'default' ? {...defaultCandidate} : action.value;
      const grades = [...election.grades, grade];
      return {...election, grades}
    }
    case 'grade-rm': {
      if (typeof action.position !== "number") {
        throw Error(`Unexpected grade position ${action.position}`)
      }
      const grades = [...election.grades];
      grades.splice(action.position)
      return {...election, grades}
    }
    case 'grade-set': {
      if (typeof action.position !== "number") {
        throw Error(`Unexpected grade position ${action.value}`)
      }
      const grades = [...election.grades];
      const grade = grades[action.position]
      grade[action.field] = action.value;
      return {...election, grades}
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}

const defaultCandidate = {
  name: "",
  description: "",
  active: false,
}

const initialElection = {
  title: "",
  description: "",
  candidates: [{...defaultCandidate}, {...defaultCandidate}],
  grades: [],
  isTimeLimited: false,
  isRandomOrder: false,
  restrictResult: true,
  restrictVote: false,
  startVote: null,
  endVote: null,
  emails: [],
};

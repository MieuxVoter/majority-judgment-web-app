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
  emails: Array<string>;
  dateEnd: string;
  dateStart?: string;
  ref?: string;
}

const defaultGrade: GradeItem = {
  name: '',
  description: '',
  value: -1,
  active: false,
};
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
  dateEnd: null,
  emails: [],
};

export enum ElectionTypes {
  SET = 'set',
  CANDIDATE_PUSH = 'candidate-push',
  CANDIDATE_RM = 'candidate-rm',
  CANDIDATE_SET = 'candidate-set',
  GRADE_PUSH = 'grade-push',
  GRADE_RM = 'grade-rm',
  GRADE_SET = 'grade-set',
}

export type SetAction = {
  type: ElectionTypes.SET;
  field: string;
  value: any;
}
export type CandidatePushAction = {
  type: ElectionTypes.CANDIDATE_PUSH;
  value: string | CandidateItem;
}
export type CandidateRmAction = {
  type: ElectionTypes.CANDIDATE_RM;
  position: number;
}
export type CandidateSetAction = {
  type: ElectionTypes.CANDIDATE_SET;
  position: number;
  field: string;
  value: any;
}
export type GradePushAction = {
  type: ElectionTypes.GRADE_PUSH;
  value: GradeItem;
}
export type GradeRmAction = {
  type: ElectionTypes.GRADE_RM;
  position: number;
}
export type GradeSetAction = {
  type: ElectionTypes.GRADE_SET;
  position: number;
  field: string;
  value: any;
}

export type ElectionActionTypes = SetAction | CandidateRmAction | CandidateSetAction | CandidatePushAction | GradeRmAction | GradeSetAction | GradePushAction;

type DispatchType = Dispatch<ElectionActionTypes>;
const ElectionContext = createContext<[ElectionContextInterface, DispatchType]>([defaultElection, () => {}]);

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
      type: ElectionTypes.SET,
      field: 'name',
      value: router.query.name || '',
    });
  }, [router.isReady]);

  return (
    <ElectionContext.Provider value={[election, dispatch]}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  /**
   * A simple hook to read the election
   */
  return useContext(ElectionContext);
}


function electionReducer(election: ElectionContextInterface, action: ElectionActionTypes): ElectionContextInterface {
  /**
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case 'set': {
      return {...election, [action.field]: action.value};
    }
    case 'candidate-push': {
      if (typeof action.value === "string" && action.value !== "default") {
        throw Error("Unexpected action")
      }
      const candidate =
        action.value === 'default' ? {...defaultCandidate} : action.value;
      const candidates = [...election.candidates, candidate];
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
      const grades = [...election.grades, action.value];
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


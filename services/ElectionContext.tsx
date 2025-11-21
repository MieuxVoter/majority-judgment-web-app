/**
 * This file provides a context and a reducer to manage an election
 */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {useRouter} from 'next/router';
import LogRocket from 'logrocket';
import {CandidateItem, GradeItem} from './type';
import {gradeColors} from '@services/grades';

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
  qrCodeCount:number;
  urlCount?: number;
  dateEnd: string;
  dateStart?: string;
  ref?: string;
  numVoters?: number;
  numVoted?: number;
  authForResult:boolean;
  errors: string[];
}

export const defaultCandidate: CandidateItem = {
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
  hideResults: false,
  forceClose: false,
  restricted: false,
  qrCodeCount:0,
  urlCount: 0,
  dateEnd: null,
  dateStart: null,
  emails: [],
  authForResult:false,
  errors: [],
};

export enum ElectionTypes {
  SET = 'set',
  RESET = 'reset',
  CANDIDATE_PUSH = 'candidate-push',
  CANDIDATE_RM = 'candidate-rm',
  CANDIDATE_SET = 'candidate-set',
  GRADE_PUSH = 'grade-push',
  GRADE_RM = 'grade-rm',
  GRADE_SET = 'grade-set',
  ADD_ERROR = 'add-error',
  REMOVE_ERROR = 'remove-error',
}

export type SetAction = {
  type: ElectionTypes.SET;
  field: string;
  value: any;
};
export type ResetAction = {
  type: ElectionTypes.RESET;
  value: ElectionContextInterface;
};
export type CandidatePushAction = {
  type: ElectionTypes.CANDIDATE_PUSH;
  value: string | CandidateItem;
};
export type CandidateRmAction = {
  type: ElectionTypes.CANDIDATE_RM;
  position: number;
};
export type CandidateSetAction = {
  type: ElectionTypes.CANDIDATE_SET;
  position: number;
  field: string;
  value: any;
};
export type GradePushAction = {
  type: ElectionTypes.GRADE_PUSH;
  value: GradeItem;
};
export type GradeRmAction = {
  type: ElectionTypes.GRADE_RM;
  position: number;
};
export type GradeSetAction = {
  type: ElectionTypes.GRADE_SET;
  position: number;
  field: string;
  value: any;
};
export type AddErrorAction = {
  type: ElectionTypes.ADD_ERROR;
  value: string;
};
export type RemoveErrorAction = {
  type: ElectionTypes.REMOVE_ERROR;
  value: string;
};

export type ElectionActionTypes =
  | SetAction
  | ResetAction
  | CandidateRmAction
  | CandidateSetAction
  | CandidatePushAction
  | GradeRmAction
  | GradeSetAction
  | GradePushAction
  | AddErrorAction
  | RemoveErrorAction;

type DispatchType = Dispatch<ElectionActionTypes>;
const ElectionContext = createContext<[ElectionContextInterface, DispatchType]>(
  [defaultElection, () => {}]
);

type ElectionProviderType = {
  children: React.ReactNode;
  initialValue?: ElectionContextInterface;
};

export const ElectionProvider = ({children, initialValue}: ElectionProviderType) => {
  /**
   * Provide the election and the dispatch to all children components
   */
  const [election, dispatch] = useReducer(electionReducer, initialValue || defaultElection);

  // At the initialization, set the name using GET param
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    if (election.name === '' && router.query.name !== '') {
      dispatch({
        type: ElectionTypes.SET,
        field: 'name',
        value: router.query.name,
      });
    }

    if (election.ref != "") {
      LogRocket.identify(election.ref, {
        name: election.name,
      });
    }
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

function electionReducer(
  election: ElectionContextInterface,
  action: ElectionActionTypes
): ElectionContextInterface {
  /**
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case ElectionTypes.RESET: {
      return {...action.value};
    }
    case ElectionTypes.SET: {
      // if (isCreated(election) && action.field === 'candidates') {
      //   throw new Error("The election has already started");
      // }
      return {...election, [action.field]: action.value};
    }
    case ElectionTypes.CANDIDATE_PUSH: {
      // if (isCreated(election)) {
      //   throw new Error("The election has already started");
      // }
      if (typeof action.value === 'string' && action.value !== 'default') {
        throw new Error('Unexpected action');
      }
      const candidate =
        action.value === 'default' ? {...defaultCandidate} : action.value;
      const candidates = [...election.candidates, candidate];
      if (candidates.filter((c) => !c.active).length === 0) {
        return {
          ...election,
          candidates: [...candidates, {...defaultCandidate}],
        };
      } else {
        return {...election, candidates};
      }
    }
    case ElectionTypes.CANDIDATE_RM: {
      if (typeof action.position !== 'number') {
        throw new Error(`Unexpected candidate position ${action.position}`);
      }
      const candidates = [...election.candidates];
      candidates.splice(action.position, 1);
      return {...election, candidates};
    }
    case ElectionTypes.CANDIDATE_SET: {
      if (typeof action.position !== 'number') {
        throw new Error(`Unexpected candidate position ${action.value}`);
      }
      if (action.field === 'active') {
        throw new Error('You are not allowed the set the active flag');
      }
      const candidates = [...election.candidates];
      const candidate = candidates[action.position];
      candidate[action.field] = action.value;
      candidate['active'] = true;
      if (!isCreated(election) && candidates.filter((c) => !c.active).length === 0) {
        return {
          ...election,
          candidates: [...candidates, {...defaultCandidate}],
        };
      }
      return {...election, candidates};
    }
    case ElectionTypes.GRADE_PUSH: {
      const grades = [...election.grades, action.value];
      return {...election, grades};
    }
    case ElectionTypes.GRADE_RM: {
      if (typeof action.position !== 'number') {
        throw new Error(`Unexpected grade position ${action.position}`);
      }
      const grades = [...election.grades];
      grades.splice(action.position);
      return {...election, grades};
    }
    case ElectionTypes.GRADE_SET: {
      if (typeof action.position !== 'number') {
        throw new Error(`Unexpected grade position ${action.position}`);
      }
      const grades = [...election.grades];
      const grade = grades.find(grade => grade.value == action.position)
      grade[action.field] = action.value;
      return {...election, grades};
    }
    case ElectionTypes.ADD_ERROR: {
      if (election.errors.includes(action.value)) {
        return election; // Avoid duplicates
      }
      const errors = [...election.errors, action.value];
      return { ...election, errors };
    }
    case ElectionTypes.REMOVE_ERROR: {
      const errors = election.errors.filter(
        (error) => error !== action.value
      );
      return { ...election, errors };
    }
    default: {
      return election;
    }
  }
}

export const isCreated = (election: ElectionContextInterface) => {
  return election.ref !== null && election.ref !== "" && election.ref !== undefined;
};

export const isClosed = (election: ElectionContextInterface) => {
  if (election.dateEnd === null) {
    return election.forceClose;
  }

  const dateEnd = new Date(election.dateEnd);
  const now = new Date();
  const isOver = +dateEnd < +now;
  return election.forceClose || isOver;
};

export const canViewResults = (election: ElectionContextInterface) => {
  const dateEnd = new Date(election.dateEnd);
  const now = new Date();
  const isOver = +dateEnd < +now;
  return election.forceClose || !election.hideResults || isOver;
};

export const hasEnoughCandidates = (election: ElectionContextInterface) => {
  const numCandidates = election.candidates.filter(
    (c) => c.active && c.name != ''
  ).length;
  return numCandidates > 1;
};

export const hasEnoughGrades = (election: ElectionContextInterface) => {
  const numGrades = election.grades.filter(
    (g) => g.active && g.name != ''
  ).length;
  return numGrades > 1 && numGrades <= gradeColors.length;
};

export const checkName = (election: ElectionContextInterface) => {
  return election.name && election.name !== '';
};

export const canBeFinished = (election: ElectionContextInterface) => {
  return (
    election.restricted ||
    election.forceClose ||
    election.dateEnd ||
    !election.hideResults
  );
};

export const NAME_MAX_LENGTH = 250;
export const NAME_ERROR_CODE = 'NAME_TOO_LONG';
export const CANDIDATE_DESCRIPTION_MAX_LENGTH = 1000;
export const CANDIDATE_DESCRIPTION_ERROR_CODE = 'CANDIDATE_DESCRIPTION_TOO_LONG';

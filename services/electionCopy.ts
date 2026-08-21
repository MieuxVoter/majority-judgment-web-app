/**
 * Carries the parameters of an existing election over to the "create election"
 * form (`pages/admin/new.tsx`), so a new election can be created re-using the
 * same candidates/grades/options. The election's ref/token/dates/votes are
 * deliberately left out: only the reusable "vote parameters" travel.
 *
 * sessionStorage is used (rather than query params) because the payload
 * (candidates, grades, description...) can be arbitrarily large, and because
 * it should only survive the single navigation to the creation form.
 */
import { ElectionContextInterface } from './ElectionContext';
import { CandidateItem, GradeItem } from './type';

const STORAGE_KEY = 'mv_copied_election_params';

export type CopiedElectionParams = Pick<
  ElectionContextInterface,
  | 'name'
  | 'description'
  | 'hideResults'
  | 'restricted'
  | 'randomOrder'
  | 'authForResult'
> & {
  candidates: Array<CandidateItem>;
  grades: Array<GradeItem>;
};

export const saveElectionParamsForCopy = (
  params: CopiedElectionParams
): void => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
};

/**
 * Reads and clears the copied election params, if any. Meant to be called
 * once, on mount of the creation form.
 */
export const popCopiedElectionParams = ():
  | CopiedElectionParams
  | undefined => {
  if (typeof window === 'undefined') return undefined;

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return undefined;

  window.sessionStorage.removeItem(STORAGE_KEY);

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

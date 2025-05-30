export interface Candidate {
  name: string,
  image?: string,
  description?: string
  id?: number;
}

export interface CandidateItem extends Candidate {
  active: boolean;
}

export interface Grade {
  name: string;
  value: number;
  description?: string;
  id?: number;
}

export interface GradeItem extends Grade {
  active: boolean;
}

export interface Vote {
  candidateId: number;
  gradeId: number;
}


export interface GradeResultInterface {
  name: string;
  description: string;
  id: number;
  value: number;
  color: string;
}


export interface MeritProfileInterface {
  [key: number]: number;
}

export interface CandidateResultInterface {
  name: string;
  description: string;
  id: number;
  image: string;
  majorityGrade: GradeResultInterface;
  meritProfile: MeritProfileInterface;
  rank: number;
}

export interface ResultInterface {
  name: string;
  description: string;
  ref: string;
  dateStart: string;
  dateEnd: string;
  hideResults: boolean;
  forceClose: boolean;
  restricted: boolean;
  voteCount?:string;
  grades: Array<GradeResultInterface>;
  candidates: Array<CandidateResultInterface>;

  ranking: {[key: string]: number};
  meritProfiles: {[key: number]: MeritProfileInterface};
}

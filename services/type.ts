export interface Candidate {
  name: string,
  image?: string,
  description?: string
}

export interface CandidateItem extends Candidate {
  active: boolean;
}

export interface Grade {
  name: string,
  value: number,
  description?: string
}

export interface GradeItem extends Grade {
  active: boolean;
}

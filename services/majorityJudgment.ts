/**
 * A few useful function for dealing with majority judgment
 */

import {MeritProfileInterface} from './type';

/**
 * Return the index corresponding to the majority grade
 */
export const getMajorityGrade = (profile: MeritProfileInterface): number => {
  const grades = Object.keys(profile).map(k => parseInt(k)).sort()

  if (grades.length === 0) {
    throw new Error('Merit profile is empty');
  }

  console.log("INDICES", grades);
  const numVotes = Object.values(profile).reduce((a, b) => a + b, 0);
  let majorityGrade = grades[0];
  let accBefore = 0;

  for (const grade of grades) {
    if (accBefore + profile[grade] > numVotes / 2 - 1e-5) {
      return grade;
    }
    accBefore -= profile[grade];
  }

  return grades[grades.length - 1];
};

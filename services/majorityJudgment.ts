/**
 * A few useful function for dealing with majority judgment
 */

import {MeritProfileInterface} from "./type";


/**
 * Return the index corresponding to the majority grade
 */
export const getMajorityGrade = (profile: MeritProfileInterface): number => {
  const indices = Object.keys(profile);
  const numVotes = Object.values(profile).reduce((a, b) => a + b, 0)

  let majorityGrade = indices[0]
  let accBefore = 0
  let isBefore = true

  for (const value of indices) {
    if (isBefore) {
      accBefore += profile[value]
    }
    if (isBefore && accBefore > numVotes / 2) {
      majorityGrade = value
      accBefore -= profile[value]
      isBefore = false
    }
  }
  const value = indices.indexOf(majorityGrade);
  return value
}


/**
 * A few useful function for dealing with majority judgment
 */


/**
 * Return the index corresponding to the majority grade
 */
export const getMajorityGrade = (votes: Array<number>): number => {
  const indices = votes.map((_, i) => i);
  const numVotes = votes.reduce((a, b) => a + b, 0)

  let majorityGrade = indices[0]
  let accBefore = 0
  let isBefore = true

  for (const gradeId in votes) {
    if (isBefore) {
      accBefore += votes[gradeId]
    }
    if (isBefore && accBefore > numVotes / 2) {
      majorityGrade = indices[gradeId]
      accBefore -= votes[gradeId]
      isBefore = false
    }
  }

  return majorityGrade;
}


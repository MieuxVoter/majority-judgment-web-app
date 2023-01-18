export const gradeColors = [
  "#990000",
  "#C23D13",
  "#C27C13",
  "#C2B113",
  "#D3D715",
  "#A0CF1C",
  "#3A9918"
];

export const gradeNames = [
  "To reject",
  "Insufficient",
  "Passable",
  "Fair",
  "Good",
  "Very good",
  "Excellent"
];

export const gradeClass = [
  "to-reject",
  "insufficient",
  "passable",
  "fair",
  "good",
  "very-good",
  "excellent"
];

export const gradeValues = [0, 1, 2, 3, 4, 5, 6, 7];

export const getGradeColor = (gradeIdx: number, numGrades: number): string => {
  const extraColors = gradeColors.length - numGrades;
  if (extraColors < 0) {
    throw new Error("More grades than available colors");
  }
  const startIndex = Math.floor(extraColors / 2);
  const colors = gradeColors.slice(startIndex, gradeColors.length - (extraColors - startIndex));
  if (colors.length < numGrades) {
    throw new Error("Issue with the number of colors");
  }
  return colors[colors.length - gradeIdx - 1]
}

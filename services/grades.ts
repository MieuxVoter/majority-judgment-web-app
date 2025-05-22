import { GradePayload } from './api';
import { DEFAULT_GRADES } from './constants';

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

export const getDefaultGrades = (t: (key: string) => string): ReadonlyArray<{name:string, value:number, active:boolean}> =>{
  return DEFAULT_GRADES.map((g, i) => ({
    name: t(g),
    value: DEFAULT_GRADES.length - 1 - i,
    active: true,
  }))
}

export const getGradeColor = (gradeIdx: number, numGrades: number): string => {
  const extraColors = gradeColors.length - numGrades;
  if (extraColors < 0) {
    throw new Error(`More grades (${numGrades}) than available colors (${gradeColors.length})`);
  }
  const startIndex = Math.floor(extraColors / 2);
  const colors = gradeColors.slice(startIndex, gradeColors.length - (extraColors - startIndex));
  if (colors.length < numGrades) {
    throw new Error("Issue with the number of colors");
  }
  return colors[gradeIdx]
}

export const getRankedGradeColor = (gradeId: number, allGrades: ReadonlyArray<GradePayload>): string | undefined => {
  const numGrades = allGrades.length;

  if (numGrades === 0) {
    console.warn("getRankedGradeColor: Called with no election grades.");
    return undefined;
  }

  if (gradeId < 0 || gradeId >= numGrades) {
    console.warn(
      `getRankedGradeColor: gradeId is out of bounds for allGrades. ` +
      `GradeId: ${gradeId}, AllGrades length: ${numGrades}.`
    );
    return undefined;
  }

  const currentGrade = allGrades[gradeId];
  const allValues = allGrades.map(g => g.value);
  const sortedValues = [...allValues].sort((a, b) => a - b);
  const rank = sortedValues.indexOf(currentGrade.value);

  if (rank === -1) {
    console.warn(
      `getRankedGradeColor: Could not determine rank for grade. ` +
      `Grade Name: ${currentGrade.name}, Value: ${currentGrade.value}. ` +
      `Sorted values: [${sortedValues.join(', ')}]`
    );
    return undefined;
  }

  try {
    const color = getGradeColor(rank, numGrades);
    if (color === undefined) {
        console.warn(
            `getRankedGradeColor: Original getGradeColor returned undefined. ` +
            `Rank: ${rank}, NumGrades ${numGrades}.`
        );
    }
    return color;
  } catch (error) {
    console.error(
      `getRankedGradeColor: Error calling original getGradeColor. ` +
      `Rank: ${rank}, NumGrades: ${numGrades}. Grade Name: ${currentGrade.name}.`,
      error
    );
    return undefined;
  }
};

const colors = [
  "#F2F0FF",
  "#C23D13",
  "#C27C13",
  "#C2B113",
  "#D3D715",
  "#A0CF1C",
  "#3A9918"
];

const gradeNames = [
  "To reject",
  "Insufficient",
  "Passable",
  "Fair",
  "Good",
  "Very good",
  "Excellent"
];

const gradeClass = [
  "to-reject",
  "insufficient",
  "passable",
  "fair",
  "good",
  "very-good",
  "excellent"
];

const gradeValues = [0, 1, 2, 3, 4, 5, 6, 7];

export const translateGrades = (t) => {
  return gradeNames.map((name, i) => ({
    label: t(name),
    color: colors[i],
    value: gradeValues[i],
    class: gradeClass[i]
  }));
};

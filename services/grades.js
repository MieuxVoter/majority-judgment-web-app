const colors = [
  "#015411",
  "#019812",
  "#6bca24",
  "#ffb200",
  "#ff5d00",
  "#b20616",
  "#6f0214"
];

const gradeNames = [
  "Excellent",
  "Very good",
  "Good",
  "Fair",
  "Passable",
  "Insufficient",
  "To reject"
];

const gradeValues = [6, 5, 4, 3, 2, 1, 0];

export const translateGrades = (t) => {
  return gradeNames.map((name, i) => ({
    label: t(name),
    color: colors[i],
    value: gradeValues[i]
  }));
};

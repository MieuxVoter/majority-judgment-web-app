import i18n from './i18n.jsx';

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
  "To reject",
];

export const grades = gradeNames.map((name, i) => ({
  label: name,
  color: colors[i]
}));

export const i18nGrades = () => {
  return gradeNames.map((name, i) => ({
    label: i18n.t(name),
    color: colors[i]
  })); 
};

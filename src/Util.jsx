import i18n from './i18n.jsx';

const colors = [
  '#6f0214',
  '#b20616',
  '#ff5d00',
  '#ffb200',
  '#6bca24',
  '#019812',
  '#015411',
];

const gradeNames = [
  'To reject',
  'Insufficient',
  'Passable',
  'Fair',
  'Good',
  'Very good',
  'Excellent',
];

export const grades = gradeNames.map((name, i) => ({
  label: name,
  color: colors[i],
}));

export const i18nGrades = () => {
  return gradeNames.map((name, i) => ({
    label: i18n.t(name),
    color: colors[i],
  }));
};

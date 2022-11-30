/**
 * This file provides useful constants for the project
 */

export const MAX_NUM_CANDIDATES = process.env.MAX_NUM_CANDIDATES || 1000;
export const CONTACT_MAIL = process.env.CONTACT_MAIL || 'app@mieuxvoter.fr';
export const DEFAULT_GRADES = process.env.DEFAULT_GRADES
  ? process.env.DEFAULT_GRADES.split(',')
  : [
    'grades.very-good',
    'grades.good',
    'grades.passable',
    'grades.inadequate',
    'grades.mediocre',
  ];
export const IMGPUSH_URL =
  process.env.IMGPUSH_URL || 'https://imgpush.mieuxvoter.fr';
export const GRADE_COLORS = [
  '#3A9918',
  '#A0CF1C',
  '#D3D715',
  '#C2B113',
  '#C27C13',
  '#C23D13',
  '#F2F0FF',
];

export const FORM_FEEDBACK = process.env.FORM_FEEDBACK || "https://forms.gle/JZ1Mtbz8gt3Fpwnx5";

export const PAYPAL = process.env.FORM_FEEDBACK || "https://www.paypal.com/donate/?hosted_button_id=QD6U4D323WV4S";

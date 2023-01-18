/**
 * This file provides useful constants for the project
 */

export const MAX_NUM_CANDIDATES =
  process.env.NEXT_PUBLIC_MAX_NUM_CANDIDATES || 1000;
export const CONTACT_MAIL =
  process.env.NEXT_PUBLIC_CONTACT_MAIL || 'app@mieuxvoter.fr';
export const DEFAULT_GRADES = process.env.NEXT_PUBLIC_DEFAULT_GRADES
  ? process.env.NEXT_PUBLIC_DEFAULT_GRADES.split(',')
  : [
    'grades.excellent',
    'grades.very-good',
    'grades.good',
    'grades.passable',
    'grades.inadequate',
  ];
export const IMGPUSH_URL =
  process.env.NEXT_PUBLIC_IMGPUSH_URL || 'https://imgpush.mieuxvoter.fr';
export const GRADE_COLORS = [
  '#3A9918',
  '#A0CF1C',
  '#D3D715',
  '#C2B113',
  '#C27C13',
  '#C23D13',
  '#F2F0FF',
];

export const FORM_FEEDBACK =
  process.env.NEXT_PUBLIC_FORM_FEEDBACK ||
  'https://forms.gle/JZ1Mtbz8gt3Fpwnx5';

export const PAYPAL =
  process.env.NEXT_PUBLIC_PAYPAL ||
  'https://www.paypal.com/donate/?hosted_button_id=QD6U4D323WV4S';

export const BETTER_VOTE_LINK =
  process.env.NEXT_PUBLIC_BETTER_VOTE || 'https://mieuxvoter.fr';

export const MAJORITY_JUDGMENT_LINK =
  process.env.NEXT_PUBLIC_MAJORITY_JUDGMENT ||
  'https://mieuxvoter.fr/le-jugement-majoritaire';
export const WHO_WE_ARE_LINK =
  process.env.NEXT_PUBLIC_WHO_WE_ARE || 'https://mieuxvoter.fr/qui-sommes-nous';
export const NEWS_LINK =
  process.env.NEXT_PUBLIC_NEWS || 'https://mieuxvoter.fr/presse';

export const URL_SERVER =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.mieuxvoter.fr/';

export const URL_LEGACY =
  process.env.NEXT_PUBLIC_URL_LEGACY || 'https://legacy.app.mieuxvoter.fr/';

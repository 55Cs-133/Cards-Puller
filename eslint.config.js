import { eslintConfig } from '@isisas/eslint-config';

export default [
  ...eslintConfig,

  {
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];

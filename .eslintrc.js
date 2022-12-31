module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'no-unused-vars': 'error',
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
  },
};

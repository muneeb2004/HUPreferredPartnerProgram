/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@hu-partner/config/eslint'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
};

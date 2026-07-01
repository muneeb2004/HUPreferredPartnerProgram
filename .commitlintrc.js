/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['web', 'api', 'types', 'utils', 'config', 'ui', 'prisma', 'docker', 'docs', 'ci'],
    ],
  },
};

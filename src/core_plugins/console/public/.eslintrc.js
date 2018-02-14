const uiConfig = require('@elastic/eslint-config-kibana/ui');
const mochaConfig = require('@elastic/eslint-config-kibana/mocha');

module.exports = {
  root: true,
  extends: ['@elastic/eslint-config-kibana'],

  overrides: [
    uiConfig({
      files: ['**/*.js'],
      rules: {
        'block-scoped-var': 'off',
        'camelcase': 'off',
        'curly': 'off',
        'dot-location': 'off',
        'dot-notation': 'off',
        'eqeqeq': 'off',
        'guard-for-in': 'off',
        'indent': 'off',
        'max-len': 'off',
        'new-cap': 'off',
        'no-caller': 'off',
        'no-empty': 'off',
        'no-extend-native': 'off',
        'no-loop-func': 'off',
        'no-multi-str': 'off',
        'no-nested-ternary': 'off',
        'no-proto': 'off',
        'no-sequences': 'off',
        'no-use-before-define': 'off',
        'one-var': 'off',
        'quotes': 'off',
        'space-before-blocks': 'off',
        'space-in-parens': 'off',
        'space-infix-ops': 'off',
        'semi': 'off',
        'strict': 'off',
        'wrap-iife': 'off',
        'no-var': 'off',
        'prefer-const': 'off',
      }
    }),
    mochaConfig({
      files: [
        'tests/**/*.js',
        'src/__tests__/**/*.js',
      ],
    }),
  ]
}

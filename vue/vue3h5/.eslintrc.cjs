/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        printWidth: 110,
        singleQuote: true,
        trailingComma: 'none',
        arrowParens: 'avoid',
        endOfLine: 'auto'
      }
    ],
    'vue/multi-word-component-names': ['warn', { ignores: ['index'] }],
    'vue/no-setup-props-destructure': ['off'],
    'no-empty': 'off'
  }
}

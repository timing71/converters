module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'import',
    'jest'
  ],
  rules: {
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['warn', 'only-multiline'],
    'dot-notation': 'off',
    'operator-linebreak': ['warn', 'after'],
    'import/extensions': ['error', 'ignorePackages'],
    'padded-blocks': 'off',
    'quote-props': 'off',
    'semi': ['warn', 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }]
  }
};

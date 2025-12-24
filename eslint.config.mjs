import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    typescript: true,
    stylistic: {
      semi: false,
      quotes: 'single',
    },
    formatters: {
      css: true,
      html: true,
    },
  },
  {
    rules: {
      // Redux Toolkit immer reducers
      'no-param-reassign': ['error', { props: false }],

      // React specific
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      'ts/consistent-type-imports': 'off',

      // Unicorn rules
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',

      // Style
      'style/brace-style': ['error', '1tbs'],
      'style/arrow-parens': ['error', 'always'],
    },
  },
  {
    files: ['**/*.stories.tsx', 'src/stories/**/*.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '.storybook',
      'storybook-static',
      'public',
      '*.min.js',
    ],
  },
)

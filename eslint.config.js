import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  pnpm: true,
  formatters: {
    css: true,
  },
  ignores: [
    '**/dist/**',
    '**/*-export/**',
  ],
}, {
  // Slidev decks: un H1 par slide est la norme du design language (docs/adr/0003).
  files: ['talks/**/*.md'],
  rules: {
    'markdown/no-multiple-h1': 'off',
  },
}, {
  // Les blocs de code des slides sont des extraits de démonstration.
  files: ['talks/**/*.md/**'],
  rules: {
    'ts/consistent-type-definitions': 'off',
  },
})

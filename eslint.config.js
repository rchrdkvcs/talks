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
})

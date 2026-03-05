import withNuxt from './apps/web/.nuxt/eslint.config.mjs';

export default withNuxt([
  {
    ignores: ['dist', '.nuxt', 'node_modules', 'lib'],
  },
  {
    files: ['packages/shared/**/*.ts', 'apps/functions/**/*.ts'],
    rules: {
      // Your custom shared rules
    }
  }
]);
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'
import type { OxfmtConfig } from 'vite-plus/fmt'
import type { OxlintConfig, OxlintOverride } from 'vite-plus/lint'

const generated = [
  '**/*.gen.ts',
  'styled-system/**', // panda codegen
  'src/api/routes/index.ts',
  'src/api/handlers/index.ts',
  'src/db/schema.ts',
  'src/hooks/index.ts',
  'src/lib/client.ts',
  'src/lib/index.ts',
]

const dirGlobs = (...names: string[]): string[] =>
  names.flatMap((name) => [`**/${name}`, `**/${name}/**`])

const relative = { group: ['./*', '../*'], message: 'Import through the `@/` alias.' }

const importBoundary = (files: string[], group: string[], message: string): OxlintOverride => ({
  files,
  rules: {
    'no-restricted-imports': ['error', { patterns: [relative, { group, message }] }],
  },
})

const lint: OxlintConfig = {
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'import', 'react', 'jsx-a11y'],
  categories: { correctness: 'error', suspicious: 'error', perf: 'error' },
  ignorePatterns: ['**/dist/**', '**/.cloudflare/**', '**/migrations/**', ...generated],
  rules: {
    'react/react-in-jsx-scope': 'off', // automatic JSX runtime
    'no-shadow': 'off', // Effect の Match.tag が意図的にシャドウする
    'no-underscore-dangle': 'off', // Data.TaggedError の _tag
    'typescript/consistent-return': 'off', // Hono の handler 契約
    'import/no-named-as-default': 'off', // react-hot-toast

    'no-console': 'error',
    eqeqeq: 'error',
    'typescript/consistent-type-imports': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-non-null-assertion': 'error',
    'react/rules-of-hooks': 'error',
    'react/button-has-type': 'error',
    'unicorn/prefer-node-protocol': 'error', // Workers は node: 付きしか解決しない
    'import/no-cycle': 'error',
  },
  options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: 'error' },
  overrides: [
    {
      files: ['src/**'],
      rules: { 'no-restricted-imports': ['error', { patterns: [relative] }] },
    },
    importBoundary(
      ['src/api/handlers/**'],
      dirGlobs('services', 'infra', 'db'),
      'Handlers depend on usecases (and the AppLive layer) only.',
    ),
    importBoundary(
      ['src/api/usecases/**'],
      [...dirGlobs('handlers', 'infra', 'db', 'layers'), 'cloudflare:workers'],
      'Usecases may only call services. Infra belongs behind a service.',
    ),
    importBoundary(
      ['src/api/services/**'],
      [...dirGlobs('handlers', 'usecases', 'layers'), 'cloudflare:workers'],
      'Services depend on infra services (yield* Database) only. Bindings come from c.env via AppLive.',
    ),
    importBoundary(
      ['src/routes/**', 'src/features/**', 'src/components/**'],
      [...dirGlobs('usecases', 'services', 'infra', 'db'), 'cloudflare:workers', '**/api/index'],
      'Frontend code talks to the API over HTTP (generated hooks / the shared client).',
    ),
    {
      files: ['src/**'],
      rules: { 'no-restricted-globals': ['error', 'process'] },
    },
  ],
}

const fmt: OxfmtConfig = {
  ignorePatterns: [
    '**/dist/**',
    '**/.cloudflare/**',
    'migrations/**',
    'api.md',
    'docs/**', // drizzler が生成
    ...generated,
  ],
  printWidth: 100,
  singleQuote: true,
  semi: false,
  sortPackageJson: true,
  sortImports: {},
}

export default defineConfig({
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), cloudflare()],
  resolve: { tsconfigPaths: true },
  lint,
  fmt,
})

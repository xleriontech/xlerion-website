import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.archive-cloudflare/**',
    'public/total-darkness/**',
    'public/redemthor/**',
    'public/el-ropero/**',
    'src/sub-apps/el-ropero/**',
    'server/**',
    'scripts/**',
    '**/*.min.js',
    '**/vendor/**',
    '**/build/**',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Los identificadores en mayúscula son componentes (p. ej. `Icon`) usados
      // en JSX; varsIgnorePattern por sí solo no cubre los parámetros
      // desestructurados de callbacks, de ahí argsIgnorePattern.
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^[A-Z_]',
      }],
    },
  },
])

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/**/__tests__/**', 'src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow exports of non-components in UI library files (shadcn/ui pattern)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Disable react-refresh rule for specific shadcn/ui component files and contexts
  {
    files: [
      'src/shared/components/ui/**/*.{ts,tsx}',
      'src/shared/contexts/**/*.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
      // shadcn/ui components commonly use 'any' types
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow @ts-nocheck for library compatibility issues
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
])

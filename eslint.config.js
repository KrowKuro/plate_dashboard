import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Google Maps injects `google` on window once the SDK loads.
        google: 'readonly',
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Context/store files intentionally export hooks and constants beside the
      // provider component; that is fine and doesn't break Vite fast refresh.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // A few effects legitimately reset local UI state (search cursor, drafts)
      // when their inputs change; treat this as advisory rather than fatal.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // Backend, build config and scripts run in Node.
    files: ['server/**/*.js', 'scripts/**/*.js', 'vite.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
])

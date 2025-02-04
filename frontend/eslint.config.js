import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import path from 'path';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'quotes': ['error', 'single'],
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json', // 경로 alias 설정
        },
        node: {
          paths: [path.resolve('./src')], // src 디렉토리 경로 alias
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // 지원 파일 확장자
        },
      },
    },
  },
)

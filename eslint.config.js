// eslint.config.js

// 引入官方推荐的 JavaScript 规则
import js from '@eslint/js';
// 引入浏览器环境的全局变量（如 window、document）
import globals from 'globals';
// 引入 React Hooks 的 ESLint 插件
import reactHooks from 'eslint-plugin-react-hooks';
// 引入 React Refresh（Fast Refresh）支持插件
import reactRefresh from 'eslint-plugin-react-refresh';
// 引入 TypeScript ESLint 插件（含解析器与规则）
import tseslint from 'typescript-eslint';

export default [
  // 忽略不需要检查的文件或文件夹
  {
    ignores: ['dist', 'node_modules'],
  },

  // 针对 TypeScript 和 React 文件进行规则配置
  {
    // 匹配的文件类型
    files: ['**/*.{ts,tsx}'],

    // 设置语言相关选项
    languageOptions: {
      ecmaVersion: 2020,            // 支持 ES2020 语法
      parser: tseslint.parser,      // 使用 TypeScript 解析器
      sourceType: 'module',         // 使用 ES Module 模块化
      globals: globals.browser,     // 启用浏览器环境下的全局变量（window、document 等）
    },

    // 配置使用的插件（key 是插件名，value 是插件对象）
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // 自定义规则
    rules: {
      // 关闭 React 17+ 中必须显式引入 React 的要求（使用 JSX 时）
      'react/react-in-jsx-scope': 'off',
      // 禁止使用 var，推荐 let 或 const
      'no-var': 'error',
      // 禁止未使用的变量
      // 'no-unused-vars': 'error',
    },
  },
];

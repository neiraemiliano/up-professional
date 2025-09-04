// eslint.config.js  (o tsconfig-flatten.js si usas tseslint)
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginImport from "eslint-plugin-import";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default tseslint.config(
  { ignores: ["dist"] },

  /* ← convierte 'plugin:react/recommended' a flat‑config */
  ...compat.extends("plugin:react/recommended"),

  /* ----- tu config propia (ya en flat) ----- */
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      react, // objeto, no string
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: eslintPluginImport,
    },

    settings: { react: { version: "detect" } },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "import/order": "off",
      "react/jsx-no-undef": ["error", { allowGlobals: true }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      // "import/no-unresolved": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export const createFrontendConfig = ({ tsconfigRootDir }) =>
  tseslint.config(
    {
      ignores: ["dist", "coverage", "node_modules"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        ecmaVersion: "latest",
        globals: {
          ...globals.browser,
          ...globals.es2022,
        },
        parserOptions: {
          project: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: true,
          },
        ],
      },
    },
    prettier,
  );

export default createFrontendConfig;

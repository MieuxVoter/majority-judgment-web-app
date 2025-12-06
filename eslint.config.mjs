import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";
import globals from "globals";

export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      ".next/",
      "node_modules/",
      "public/",
      ".vscode/",
      "next-env.d.ts"
    ],
  },

  // 2. Base Javascript & TypeScript Configuration
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. React Configuration (For your App)
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
        "react-hooks": pluginReactHooks,
        "@next/next": pluginNext,
    },
    settings: {
        react: {
            version: "detect",
        }
    },
    rules: {
        ...pluginReactHooks.configs.recommended.rules,
        ...pluginNext.configs.recommended.rules,
        ...pluginNext.configs["core-web-vitals"].rules,
        "react/react-in-jsx-scope": "off",
    }
  },

  // 4. Node.js Scripts Configuration (NEW SECTION)
  // This fixes the errors in scripts/ and config/
  {
    files: ["scripts/**/*.js", "config/**/*.js", "*.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Allows 'process', 'module', 'require'
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off" // Sometimes needed for legacy scripts
    }
  }
);

/* eslint-disable import-x/no-named-as-default-member */
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import { importX } from "eslint-plugin-import-x"

// `typescript-eslint` recommends using `defineConfig` from `eslint/config`, but
// its own configs are not yet compatible with it. For the time being, we're
// using the deprecated `config` function.
//
// https://github.com/typescript-eslint/typescript-eslint/issues/11543#issuecomment-3258864673
//
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  // Base JS configuration with recommended configs
  js.configs.recommended,

  // TypeScript configuration
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      curly: ["error", "all"],
      "no-duplicate-imports": "off",
      "no-unused-vars": "off",
      "object-shorthand": ["error", "properties"],
      "no-unneeded-ternary": "error",
      "no-implicit-coercion": "error",

      // Import rules
      "import-x/order": [
        "warn",
        {
          "newlines-between": "never",
        },
      ],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-import-type-side-effects": "error",

      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
        },
      ],

      "@typescript-eslint/array-type": "error",

      "@typescript-eslint/restrict-template-expressions": [
        "warn",
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: true,
        },
      ],

      // We allow non-null assertions! Since we are using
      // `noUncheckedIndexedAccess`, there are many places where forbidding
      // non-null assertions would make correct code overly defensive. Instead,
      // by allowing non-null assertions, we can call out places where we are
      // making assumptions about a value, making it easier to review while
      // enabling stricter ESLint checking.
      "@typescript-eslint/no-non-null-assertion": "off",

      // Permit things like `while (true) { … }`
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: "only-allowed-literals",
        },
      ],

      // Allow explicit types even when the type is inferrable
      "@typescript-eslint/no-inferrable-types": "off",
    },
  },

  // Ignore patterns
  { ignores: ["node_modules/*", "dist/*"] }
)

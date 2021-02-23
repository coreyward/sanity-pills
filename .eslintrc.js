module.exports = {
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
  },
  env: {
    jest: true,
  },
}

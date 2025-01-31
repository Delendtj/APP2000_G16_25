module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "react/react-in-jsx-scope": "off",
  },
};

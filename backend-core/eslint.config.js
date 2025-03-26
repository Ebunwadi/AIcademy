const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      complexity: ["warn", { max: 15 }],
        "no-undef": "off",
        "no-unused-vars": "off"
    },
    ignores: ["frontend/src/assets/**"],
  },
];

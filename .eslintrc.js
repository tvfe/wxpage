module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 7
  },
  "rules": {
    "no-undef": "error",
    "no-unused-vars": "error"
  },
  "globals": {
    "wx": true,
    "App": true,
    "Page": true,
    "Component": true,
    "getApp": true,
    "getCurrentPages": true
  },
  "env": {
    "browser": true,
    "node": true
  }
}

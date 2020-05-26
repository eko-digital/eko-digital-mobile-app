module.exports = {
  root: true,
  extends: ["airbnb", "airbnb/hooks", "plugin:flowtype/recommended"],
  plugins: [
    "flowtype"
  ],
  globals: {
    "__DEV__": "readonly",
    "fetch": "readonly",
  }
};

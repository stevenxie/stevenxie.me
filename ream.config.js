const { resolve } = require("path");
const relative = path => resolve(__dirname, path);

// Configure webpack.
const webpackPlugin = {
  name: "webpack-plugin",
  apply: api =>
    api.chainWebpack(config => {
      config.resolve.alias.set("@", relative("src"));
    }),
};

module.exports = {
  entry: "./src/main.js",
  plugins: [webpackPlugin],
  pwa: false,
  css: {
    extract: true,
  },
};

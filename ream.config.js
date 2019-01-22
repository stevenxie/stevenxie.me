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

// Configure server.
// const serverPlugin = {
//   name: "server-plugin",
//   apply: api =>
//     api.
// }

module.exports = {
  entry: "./src/main.js",
  plugins: [webpackPlugin /* contextPlugin */],
  pwa: false,
  css: {
    extract: true,
  },
};

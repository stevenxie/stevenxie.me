const { EnvironmentPlugin } = require("webpack");
const { resolve } = require("path");
const relative = path => resolve(__dirname, path);

// Configure environment.
require("./env.config");

// Configure webpack.
const webpackPlugin = {
  name: "webpack-plugin",
  apply: api =>
    api.chainWebpack(config => {
      config.resolve.alias.set("@", relative("src"));
      config
        .plugin("environment")
        .use(EnvironmentPlugin, ["NODE_ENV", "BASE_URL", "API_URL"]);
    }),
};

// Disable 'X-Powered-By' header, etc.
const expressPlugin = {
  name: "express-plugin",
  apply: api => api.configureServer(app => app.disable("x-powered-by")),
};

module.exports = {
  entry: "./src/main.js",
  plugins: [webpackPlugin, expressPlugin],
  pwa: false,
  css: {
    extract: true,
  },
};

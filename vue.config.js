const PrerenderSPAPlugin = require("prerender-spa-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { IgnorePlugin } = require("webpack");
const path = require("path");

const { PuppeteerRenderer } = PrerenderSPAPlugin;

// Select routes to prerender.
const prerenderRoutes = ["/", "/location"];

// Configure constants and envvars.
const distDir = path.join(__dirname, "dist");
const { SHOW_PRERENDERING } = process.env;

const buildPrerenderSPAPlugin = () =>
  new PrerenderSPAPlugin({
    staticDir: distDir,
    routes: prerenderRoutes,
    renderer: new PuppeteerRenderer({
      renderAfterDocumentEvent: "render-event",
      headless: !SHOW_PRERENDERING,

      // Inject window properties during prerendering.
      injectProperty: "__PRERENDER_INJECTED",
      inject: {},
    }),
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      keepClosingSlash: true,
      minifyCSS: true,
    },
    postProcess(context) {
      // If a route doesn't end with '/', write it to '[route].html'.
      const { route } = context;
      if (/^[^\\.]+[^\\/]$/.test(route))
        context.outputPath = path.join(distDir, `${route}.html`);
      return context;
    },
  });

// Configure webpack.
const configureWebpack = config => {
  config.devtool = "source-map";

  // Plugins for all modes:
  config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/));

  switch (config.mode) {
    case "development":
      if (process.env.PRERENDER) config.plugins.push(buildPrerenderSPAPlugin());
      break;

    default:
      config.plugins.push(buildPrerenderSPAPlugin());

      // Configure bundle analysis.
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: "webpack-bundle-analyzer-report.html",
        })
      );
  }
};

module.exports = {
  configureWebpack,
  devServer: { disableHostCheck: true },
};

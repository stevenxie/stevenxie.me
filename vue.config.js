const PrerenderSPAPlugin = require("prerender-spa-plugin");
const { PuppeteerRenderer } = PrerenderSPAPlugin;
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const path = require("path");

// Select routes to prerender.
const prerenderRoutes = ["/"];

// Configure constants and envvars.
const distDir = path.join(__dirname, "dist");
const { SHOW_PRERENDERING } = process.env;

// Configure webpack.
const configureWebpack = config => {
  config.devtool = "source-map";
  if (config.mode !== "production") return;

  // Configure prerendering.
  config.plugins.push(
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
    })
  );

  // Configure bundle analysis.
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "webpack-bundle-analyzer-report.html",
    })
  );
};

module.exports = { configureWebpack };

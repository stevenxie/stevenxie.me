const PrerenderSPAPlugin = require("prerender-spa-plugin");
const { PuppeteerRenderer } = PrerenderSPAPlugin;
const { join } = require("path");

// Select routes to prerender.
const prerenderRoutes = ["/", "/about"];

// Configure constants and envvars.
const distDir = join(__dirname, "dist");

// Configure webpack.
const configureWebpack = config => {
  if (config.mode !== "production") return;

  // Configure prerendering.
  config.plugins.push(
    new PrerenderSPAPlugin({
      staticDir: distDir,
      routes: prerenderRoutes,
      renderer: new PuppeteerRenderer({
        renderAfterDocumentEvent: "render-event",
      }),
      // If a route doesn't end with '/', write it to [route].html
      postProcess(renderedRoute) {
        const { route } = renderedRoute;
        if (/^[^\\.]+[^\\/]$/.test(route))
          renderedRoute.outputPath = join(distDir, `${route}.html`);
        return renderedRoute;
      },
    })
  );
};

module.exports = { configureWebpack };

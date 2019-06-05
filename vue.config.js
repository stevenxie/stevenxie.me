const PrerenderSPAPlugin = require("prerender-spa-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// const cheerio = require("cheerio");
const path = require("path");

const { PuppeteerRenderer } = PrerenderSPAPlugin;

// Select routes to prerender.
const prerenderRoutes = ["/"];

// Configure constants and envvars.
const distDir = path.join(__dirname, "dist");
const { SHOW_PRERENDERING } = process.env;

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
      },
      postProcess(context) {
        // If a route doesn't end with '/', write it to '[route].html'.
        const { route /*, html */ } = context;
        if (/^[^\\.]+[^\\/]$/.test(route))
          context.outputPath = path.join(distDir, `${route}.html`);

        /*
        // Modify HTML to inject '__PRERENDERED' global variable.
        //
        // This will be used to detect whether or not the page has been
        // prerendered, in order to trigger Vue app hydration, etc.
        const $ = cheerio.load(html);
        $("head").prepend(
          '<script type="text/javascript">var __PRERENDERED=true;</script>'
        );
        context.html = $.html();
        */

        return context;
      },
    })
  );

  // Configure bundle analysis.
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
};

module.exports = { configureWebpack };

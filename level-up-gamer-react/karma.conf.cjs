// Configuración de Karma + Jasmine para probar componentes React.
// Karma abre un Chrome real (headless), así que localStorage, eventos y
// el DOM funcionan igual que en el navegador.

module.exports = function (config) {
  config.set({
    proxies: { "/img/": "http://localhost:5173/img/" },
    basePath: "",
    frameworks: ["jasmine", "webpack"],

    // Un solo punto de entrada: src/test/index.js junta todos los *.spec
    files: [{ pattern: "src/test/index.js", watched: false }],
    preprocessors: { "src/test/index.js": ["webpack"] },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
              },
            },
          },
          // Los componentes importan .css; url/import en false para que
          // no intente resolver imágenes ni Google Fonts durante los tests.
          {
            test: /\.css$/,
            use: ["style-loader", { loader: "css-loader", options: { url: false, import: false } }],
          },
          // Paquetes ESM (react-router) que importan sin extensión
          { test: /\.m?js$/, resolve: { fullySpecified: false } },
        ],
      },

    },

    reporters: ["progress"],
    browsers: ["ChromeHeadlessSinSandbox"],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    singleRun: false,
    restartOnFileChange: true,
  });
};

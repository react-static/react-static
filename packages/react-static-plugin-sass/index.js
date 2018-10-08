import ExtractCssChunks from "extract-css-chunks-webpack-plugin";

export default ({ includePaths = [], ...rest }) => ({
  webpack: (config, { stage }) => {
    let loaders = [];

    const sassLoaderPath = require.resolve("sass-loader");

    const sassLoader = {
      loader: sassLoaderPath,
      options: { includePaths: ["src/", ...includePaths], ...rest }
    };
    const styleLoader = { loader: "style-loader" };
    const cssLoader = {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        minimize: stage === "prod",
        sourceMap: false
      }
    };

    if (stage === "dev") {
      // Dev
      loaders = [styleLoader, cssLoader, sassLoader];
    } else if (stage === "node") {
      // Node
      // Don't extract css to file during node build process
      loaders = [cssLoader, sassLoader];
    } else {
      // Prod
      loaders = [ExtractCssChunks.loader, cssLoader, sassLoader];
    }

    config.module.rules[0].oneOf.unshift({
      test: /\.s(a|c)ss$/,
      use: loaders
    });

    return config;
  }
});

import fs from "fs";

// we check which babel config file exists in the project root
const readBabelConfig = (root) => {
  const babelFiles = [`${root}/.babelrc`, `${root}/.babelrc.js`,`${root}/.babel.config.js`];

  let extendsFile = {};

  babelFiles.forEach(file => {
    try {
      fs.statSync(file);
      extendsFile = {extends: file}
    }
    catch(err) {
      // dont do anything
    }
  });

  return extendsFile;
}

export default function({ config, stage }) {
  let babelFile = {};

  if (config.paths.DIST.indexOf(config.paths.ROOT) !== 0) {
    babelFile = readBabelConfig(config.paths.ROOT);
  }

  return {
    test: /\.(js|jsx)$/,
    exclude: new RegExp(`(node_modules|${config.paths.EXCLUDE_MODULES})`),
    use: [
      {
        loader: 'babel-loader',
        options: {
          ...babelFile,
          root: config.paths.ROOT,
          presets: [[babelPreset, { modules: false }]],
          cacheDirectory: stage !== 'prod',
        },
      },
    ],
  }
}

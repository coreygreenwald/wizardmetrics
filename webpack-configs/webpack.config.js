module.exports = {
    entry: './browser/plugin/main.js',
    output: {
      path: __dirname,
      filename: '../public/plugin/bundle.js'
    },
    devtool: 'eval'
  };

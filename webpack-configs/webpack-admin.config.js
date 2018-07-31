// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './browser/admin/index.js',
    output: {
      path: __dirname,
      filename: '../public/admin/bundle.js'
    },
    // plugins: [
    //   new BundleAnalyzerPlugin()
    // ],  
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query:
          {
            presets:['react']
          }
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => {
  const isDevelopment = argv.mode !== 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    devServer: {
      port: 3100,
      hot: true,
      historyApiFallback: true,
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  };
};

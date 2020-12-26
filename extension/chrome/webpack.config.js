const GenerateJsonFile = require('generate-json-file-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { join } = require('path');
const configParam = require('../allParam.config');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    contentScript: join(__dirname, 'src/fg/contentScript.ts'),
    backgroundPage: join(__dirname, 'src/bg/backgroundPage.ts')
  },
  output: {
    path: join(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: 'awesome-typescript-loader?{configFileName: "chrome/tsconfig.json"}'
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "ejs-compiled-loader",
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new GenerateJsonFile({
      jsonFile: join(__dirname, 'manifest.json'),
      filename: 'manifest.json',
      value: (manifest) => {
        manifest.permissions.push(configParam.URIApi + "api/*");
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: true
  }
};

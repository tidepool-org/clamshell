var path = require('path');
var webpack = require('webpack');

var entry = (process.env.MOCK === 'true') ? './src/main.mock.js' : './src/main.js';

// these values are required in the config.app.js file -- we can't use
// process.env with webpack, we have to create these magic constants
// individually.
var defineEnvPlugin = new webpack.DefinePlugin({
  __MOCK__: JSON.stringify(process.env.MOCK || null),
  __API_HOST__: JSON.stringify(process.env.API_HOST || null),
  __LONGTERM_KEY__: JSON.stringify(process.env.LONGTERM_KEY || null)
});

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /sinon\.js$/, loader: "imports?define=>false"},
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},
      {test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif'},
      {test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg'},
      {test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png'},
      {test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
      {test: /\.eot$/, loader: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject'},
      {test: /\.woff$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url-loader?limit=10000&mimetype=application/x-font-ttf'},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  },
  plugins: [
    defineEnvPlugin
  ],
  // to fix the 'broken by design' issue with npm link-ing modules
  resolve: { fallback: path.join(__dirname, 'node_modules') },
  resolveLoader: { fallback: path.join(__dirname, 'node_modules') }
};

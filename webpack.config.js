/* eslint no-var: 0 */
var webpack = require('webpack')

module.exports = {
  cache: true,
  entry: {
    app: './static/src/index.es6',
    vendor: './static/src/vendor.es6',
  },
  output: {
    path: './static/dist/',
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.tag\.html$/, include: /static\/src/, loader: 'riotjs' },
      { test: /\.es6$/, include: /static\/src/, loader: 'babel', query: {modules: 'common'} },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot',
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js'),
  ],
  devtool: 'source-map',
  devServer: {
    port: 18000,
    inline: true,
    contentBase: 'static',
    proxy: {
      '/*': 'http://localhost:17000/',
    },
  },
}

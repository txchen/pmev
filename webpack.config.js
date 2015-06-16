var webpack = require('webpack')

module.exports = {
  cache: true,
  entry: {
    app: './static/src/index.js',
    vendor: './static/src/vendor.js',
  },
  output: {
    path: './static/dist/',
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, include: /static\/src/, loader: 'style!css' },
      { test: /\.html$/, include: /static\/src/, loader: 'riotjs' },
      { test: /\.js$/, include: /static\/src/, loader: 'babel', query: {modules: 'common'} }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
  ],
  devtool: "source-map",
  devServer: {
    port: 18000,
    inline: true,
    contentBase: "static",
    proxy: {
      '/*': 'http://localhost:17000/'
    }
  }
}

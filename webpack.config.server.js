// Configuramos Webpack para empaquetar el código del servidor

const path = require('path')
const nodeExternals = require('webpack-node-externals') // to require nodeExternals
const CURRENT_WORKING_DIR = process.cwd()

const config = {
  name: "server",
  // The mode option is not set here explicitly but will be passed as required when running the Webpack commands with respect to running for development or building for production
  entry: [ path.join(CURRENT_WORKING_DIR , './server/server.js') ], // Webpack starts bundling from the server folder with server.js
  target: "node",
  output: { // outputs the bundled code in server.generated.js in the dist folder
    path: path.join(CURRENT_WORKING_DIR , '/dist/'),
    filename: "server.generated.js",
    publicPath: '/dist/',
    libraryTarget: "commonjs2" // During bundling, a CommonJS environment will be assumed
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },

      {
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader'
      } 
    ]
  }
}

module.exports = config
// Configuramos Webpack para empaquetar el código del cliente para desarrollo
// Para instalar Webpack yarn add --dev webpack webpack-cli webpack-node-externals

const path = require('path')
const webpack = require('webpack')
const CURRENT_WORKING_DIR = process.cwd()

const config = {
    name: "browser",
    mode: "development", // sets process.env.NODE_ENV to the given value and tells Webpack to use its built-in optimizations accordingly. If not set explicitly, it defaults to a value of "production".
    devtool: 'eval-source-map', // specifies how source maps are generated, if at all. Generally, a source map provides a way of mapping code within a compressed file back to its original position in a source file to aid debugging
    entry: [ // specifies the entry file where Webpack starts bundling, in this case with the main.js file in the client folder
      'webpack-hot-middleware/client?reload=true',
      path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: { // specifies the output path for the bundled code, in this case set to dist/bundle.js
      path: path.join(CURRENT_WORKING_DIR , '/dist'),
      filename: 'bundle.js',
      publicPath: '/dist/' // allows specifying the base path for all assets in the application
    },    
    module: { 
      rules: [
        {
          // sets the regex rule for the file extension to be used for transpilation, and the folders to be excluded. The transpilation tool to be used here is babel-loader
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        
        {
          // This module rule uses the file-loader node module for Webpack, which needs to be installed as a development dependency, as follows: yarn add --dev file-loader
          // With this image bundling configuration added, the home page component should successfully render the image when we run the application.  
          test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
          use: 'file-loader'
        }   
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(), // enables hot module replacement for react-hot-loader
      new webpack.NoEmitOnErrorsPlugin() // allows skipping emitting when there are compile errors
    ],
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom' // add a Webpack alias to point react-dom references to the @hotloader/react-dom version
    }
}
}

module.exports = config
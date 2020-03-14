const path = require('path');

module.exports = {
  entry: {
		filename: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'arithExpr',
    libraryTarget: 'umd',
	},
  module: {
    rules: [
      {
        test: /\.pegjs$/,
        loader: 'pegjs-loader'
      }
    ]
  }
};
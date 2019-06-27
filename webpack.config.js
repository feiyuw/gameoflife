module.exports = {
  entry: './gol.react.js',
  output: {
    path: __dirname,
    filename: 'gol.react.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}

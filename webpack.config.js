const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Entry point for your JavaScript
  output: {
    filename: "bundle.js", // Output file name
    path: path.resolve(__dirname, "dist"), // Output directory
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply babel-loader to all .js files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Apply CSS loaders
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve files from the dist directory
    },
    watchFiles: ["./src/**/*", "./index.html"], // Watch for changes in the src directory and the index.html
    compress: true, // Enable gzip compression
    port: 9000, // Port to serve on
    hot: true, // Enable hot module replacement
    open: true, // Automatically open the browser when server starts
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Template file
      filename: "index.html", // Output file
      inject: "body", // Inject the script tag at the end of the body
    }),
  ],
  mode: "development",
};

import webpack from "webpack";
import dotenv from "dotenv";
import path from "path";
// Load env variables
dotenv.config();

import { startServer } from "./backend/startServer";
import DotenvPlugin from "dotenv-webpack";

// Build front end assets
webpack(
  {
    entry: "./frontend/App.js",
    mode: "development",
    output: {
      path: path.resolve("static"),
      filename: "bundle.js"
    },
    devtool: "source-map",
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".js", ".json"]
    },
    node: {
      fs: "empty"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    },
    plugins: [
      new DotenvPlugin({
        path: "./.env"
      })
    ]
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      // Handle errors here
      console.log(err || stats);
    }

    // Simple graphQL endpoint
    startServer();
  }
);



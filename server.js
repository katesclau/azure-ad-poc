import { GraphQLServer } from 'graphql-yoga'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'
import webpack from 'webpack'
import express from 'express'
import DotenvPlugin from 'dotenv-webpack'

// Load env variables
dotenv.config();


// Build front end assets
webpack({
  entry: './frontend/App.js',
  mode: 'development',
  output: {
    path: path.resolve('static'),
    filename: 'bundle.js'
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".js", ".json"]
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new DotenvPlugin({
      path: './.env'
    })
  ]
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    console.log(err || stats)
  }

  // Simple graphQL endpoint
  const typeDefs = `
    type Query {
      login(name: String, password: String): String!
      signup(name: String, password: String, email: String): String!
    }
  `

  const resolvers = {
    Query: {
      login: (_, { name, password }) => `Hello ${name || 'World'}`,
      signup: (_, { name, password, email }) => `Hello ${name || 'World'}`,
    },
  }

  const server = new GraphQLServer({ 
    typeDefs, 
    resolvers,
    context: req => ({
      ...req
    })
  })

  const options = {
      port: process.env.PORT || 3000,
      endpoint: '/graphql',
      subscriptions: '/subscriptions',
      playground: '/playground',
  }

/*
  // Configure morgan module to log all requests.
  server.express.use(morgan)
*/
  // Set the front-end folder to serve public assets.
  server.express.use(express.static('static'))

  // Set up our one route to the index.html file.
  server.express.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
  });
  server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`)
  });
});



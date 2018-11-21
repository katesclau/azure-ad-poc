import { GraphQLServer } from "graphql-yoga"
import morgan from "morgan"
import cors from 'cors'
import path from "path"
import express from "express"
import cookieParser from 'cookie-parser'
import session from 'express-session';
import bodyParser from "body-parser"
import methodOverride from 'method-override'
import passport from 'passport'
import graphQLCombine from 'graphql-combine';

import config from '../config'
import azureAd from './providers/azureAd'
import { configureOIDC, authenticate, ensureAuthenticated } from "../common/OIDCHelper"

passport.use(configureOIDC());

export function startServer() {
  
  // TypeDefs
  const { typeDefs, resolvers } = graphQLCombine({
    // TypeDefs glob pattern
    resolvers: path.join(__dirname, "./", `/*/resolver.js`),
    typeDefs: path.join(__dirname, "./", '/*/*.graphql'),
  });
  
  // Initialize GraphQLServer via graphql-yoga
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ctx => {
      const { user } = ctx.request;
      const dataSources = {
        azureAd
      }
      return { user, dataSources }
    }
  });
  
  const options = {
    port: process.env.PORT || 3000,
    endpoint: "/graphql",
    subscriptions: "/subscriptions",
    playground: "/playground"
  }

  server.express.use('*', cors({ origin: `http://localhost:${process.env.PORT}` }));
  
  // Configure morgan module to log all requests.  
  server.express.use(morgan("combined"))
  server.express.use(methodOverride())

  // You can also use cookies to store access- just update the variables used on OIDCHelper.js on config.js
  server.express.use(cookieParser())
  server.express.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge: config.mongoDBSessionMaxAge * 1000},
    resave: true,
    saveUninitialized: true
  }))
  server.express.use(bodyParser.urlencoded({ extended : true }))

  
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  server.express.use(passport.initialize())
  server.express.use(passport.session())

  // Set the front-end folder to serve public assets.
  server.express.use(express.static(path.join(__dirname + "/../static")))

  //-----------------------------------------------------------------------------
  // Set up the route controller
  //
  // 1. For 'login' route and 'returnURL' route, use `passport.authenticate`. 
  // This way the passport middleware can redirect the user to login page, receive
  // id_token etc from returnURL.
  //
  // 2. For the routes you want to check if user is already logged in, use 
  // `ensureAuthenticated`. It checks if there is an user stored in session, if not
  // it will call `passport.authenticate` to ask for user to log in.
  //-----------------------------------------------------------------------------
  server.express.get('/login', authenticate, (req, res) => {
    console.log('Login was called in the Sample');
    res.redirect('/me');
  });
  
  // 'GET returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // query (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  server.express.get('/auth/openid/return', authenticate, (req, res) => {
    console.log('GET: We received a return from AzureAD.');
    req.session.save(() => res.redirect('/me'))
  });
  
  // 'POST returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // body (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  server.express.post('/auth/openid/return', authenticate, (req, res) => {
    console.log('POST: We received a return from AzureAD.');
    res.redirect('/me')
  });

  // 'logout' route, logout from passport, and destroy the session with AAD.
  server.express.get('/logout', (req, res) => {
    req.session.destroy(err => {
      req.logOut();
      res.redirect(config.destroySessionUrl);
    });
  });

  // Set up our one route to the index.html file.
  server.express.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/../static/index.html"));
  });

  // Set up our one route to the index.html file.
  server.express.get("/me", ensureAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname + "/../static/index.html"));
  });

  server.express.get("/oops", function (req, res) {
    res.sendFile(path.join(__dirname + "/../static/index.html"));
  });
  
  server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`);
  });
}
import { GraphQLServer } from "graphql-yoga"
import morgan from "morgan"
import path from "path"
import express from "express"
import passport from 'passport'
import configureOIDC from "../common/OIDCHelper"
import methodOverride from "method-override"
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from "body-parser"


passport.use(configureOIDC());

export function startServer() {
  const typeDefs = `
    type Query {
      login(name: String, password: String): String!
      signup(name: String, password: String, email: String): String!
    }
  `;
  const resolvers = {
    Query: {
      login: (_, { name, password }) => `Hello ${name || "World"}`,
      signup: (_, { name, password, email }) => `Hello ${name || "World"}`
    }
  };
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => ({
      ...req
    })
  });
  const options = {
    port: process.env.PORT || 3000,
    endpoint: "/graphql",
    subscriptions: "/subscriptions",
    playground: "/playground"
  };

  // You can also use cookies to store access- just update the variables used on OIDCHelper.js on config.js
  server.express.use(methodOverride());
  server.express.use(cookieParser());
  
  server.express.use(session({ 
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: false, 
    cookie: { 
      secure: true 
    }
  }));

  server.express.use(bodyParser.urlencoded({ extended : true }));
  
  // Configure morgan module to log all requests.
  server.express.use(morgan("combined"));
  // Set the front-end folder to serve public assets.
  server.express.use(express.static("static"));
  // Set up our one route to the index.html file.
  server.express.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));
  });

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  server.express.use(passport.initialize());
  server.express.use(passport.session());

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
  //-----------------------------------------------------------------------------server.express.get('/login', (req, res, next) => {
  server.express.get('/login', (req, res, next) => {
    passport.authenticate('azuread-openidconnect', { 
      response: res,                      // required
      failureRedirect: '/' 
    })(req, res, next)}, (req, res) => {
      console.log('Login was called in the Sample');
      console.log(req);
      res.redirect('/');
  });
  
  // 'GET returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // query (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  server.express.get('/auth/openid/return', (req, res, next) => {
    passport.authenticate('azuread-openidconnect', { 
      response: res,                      // required
      failureRedirect: '/'  
    })(req, res, next)}, (req, res) => {
      console.log('We received a return from AzureAD.');
      console.log(req);
      res.redirect('/');
  });

  // 'POST returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // body (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  server.express.post('/auth/openid/return', (req, res, next) => {
    passport.authenticate('azuread-openidconnect', { 
      response: res,                      // required
      failureRedirect: '/'  
    })(req, res, next);
  }, (req, res) => {
    console.log('We received a return from AzureAD.')
    console.log(req.user.displayName)
    res.redirect('/')
  });

  // 'logout' route, logout from passport, and destroy the session with AAD.
  server.express.get('/logout', (req, res) => {
    req.session.destroy(err => {
      req.logOut();
      res.redirect(config.destroySessionUrl);
    });
  });

  server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`);
  });
}
import passport from 'passport'
import { OIDCStrategy } from 'passport-azure-ad'
import { creds } from '../config'
import { users, findByOid } from '../backend/users/users'

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/oops');
};

const authenticate = (req, res, next) => {
  passport.authenticate('azuread-openidconnect', { 
    response: res,                      // required
    customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
    failureRedirect: '/oops'
  })(req, res, next);
}

const configureOIDC = () => new OIDCStrategy({  
  identityMetadata: creds.identityMetadata,
  clientID: creds.clientID,
  responseType: creds.responseType,
  responseMode: creds.responseMode,
  redirectUrl: creds.redirectUrl,
  allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
  clientSecret: creds.clientSecret,
  validateIssuer: creds.validateIssuer,
  isB2C: creds.isB2C,
  issuer: creds.issuer,
  passReqToCallback: creds.passReqToCallback,
  scope: creds.scope,
  loggingLevel: creds.loggingLevel,
  nonceLifetime: creds.nonceLifetime,
  nonceMaxAmount: creds.nonceMaxAmount,
  useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
  cookieEncryptionKeys: creds.cookieEncryptionKeys,
  clockSkew: creds.clockSkew,
}, (iss, sub, profile, accessToken, refreshToken, params, done) => {
  if (!profile.oid) {
    return done(new Error("No oid found"), null);
  }
  // asynchronous verification, for effect...
  process.nextTick(function () {
    findByOid(profile.oid, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = { oid: profile.oid, name: profile.displayName, email: profile.upn, photoURL: "", id_token: params.id_token, access_token: params.access_token, refresh_token: params.refresh_token }
        // "Auto-registration"
        users.push(user);
        return done(null, user);
      }
      return done(null, user);
    });
  });
});

export { configureOIDC, authenticate, ensureAuthenticated }
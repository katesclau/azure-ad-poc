import passport from 'passport'
import { OIDCStrategy } from 'passport-azure-ad'
import { creds } from '../config'
import { users, findByOid } from '../backend/users/users'

console.log('OIDC start...')
console.log(creds)

const ensureAuthenticated = (req, res, next) => {
  console.log('Assuring authentication.');
  console.log(req.session);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/oops');
};

const authenticate = (req, res, next) => {
  passport.authenticate('azuread-openidconnect', { 
    response: res,                      // required
    customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
    failureRedirect: '/oops',
    failureFlash: true
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
}, (iss, sub, profile, accessToken, refreshToken, done) => {
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
        // "Auto-registration"
        users.push(profile);
        return done(null, profile);
      }
      return done(null, user);
    });
  });
});

export { configureOIDC, authenticate, ensureAuthenticated }
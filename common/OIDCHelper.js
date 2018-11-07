import { OIDCStrategy } from 'passport-azure-ad'
import { creds } from '../config'
import { users, findByOid } from '../backend/users/users'


console.log('OIDC start...')
console.log(creds)


const configureOIDC = () => new OIDCStrategy({
  callbackURL: creds.returnURL,
  realm: creds.realm,
  clientID: creds.clientID,
  clientSecret: creds.clientSecret,
  oidcIssuer: creds.issuer,
  identityMetadata: creds.identityMetadata,
  skipUserProfile: creds.skipUserProfile,
  responseType: creds.responseType,
  responseMode: creds.responseMode,
  allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
  validateIssuer: creds.issuer,
  redirectUrl: creds.redirectUrl,
  loggingLevel: "info",
  useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
  session: creds.session,
  cookieEncryptionKeys: creds.cookieEncryptionKeys
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

export default configureOIDC
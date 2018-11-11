# Azure AD Login sample
==============================================================

## What is this?

This is a sample repository on how to SSO with Azure AD and get the ID Token for a given user... you'll need that ID Token to communicate with any API provided in the APP configuration registry. You can also use it as main source of user access control for any application.

## Configuration

1. Copy `.sample.env` to `.env`

2. Register an Application on Azure AD page, with redirect URI as `http://localhost:3000`
https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredAppsPreview

3. Copy over the **Client ID** and **Directory (tenant) ID** to the `.env` file
![Client and Tenant IDs](./images/client_tenant_id.png)

4. Create a new Client Secret on https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Credentials
![Client Secret created](./images/client_secret.png)    

5. Update **Client Secret value** on `.env` file

6. Start the Server
`npm start`

7. Access `http://localhost:3000`

8. Click on Login (OIDC flow) 
![OpenID Connect Flow](./images/OIDC_flow.png)

9. Get redirected to Profile

*BONUS* - Sign out from Azure AD SSO

## Todo

* Enable OAuth Implicit Flow back

## References

Msal
https://github.com/AzureAD/microsoft-authentication-library-for-js

Msal usage example
https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2

Azure AD (Passport.js) strategy
https://docs.microsoft.com/en-us/azure/active-directory/

Azure AD passport strategy usage example
https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs
# Azure AD Login sample
==============================================================

## What is this?

This is a sample repository on how to SSO with Azure AD and get the ID Token for a given user... you'll need that ID Token to communicate with any API provided in the APP configuration registry. You can also use it as main source of user access control for any application.

This is the usual flow...
![./images/javascriptspa-intro.png](./images/javascriptspa-intro.png)

## Configuration

Copy `.sample.env` to `.env`

1. Register an Application on Azure AD page, with redirect URI as `http://localhost:3000`
https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredAppsPreview

2. Copy over the **Client ID** and **Directory (tenant) ID** to the `.env` file
![./images/client_tenant_id.png](./images/client_tenant_id.png)

3. Update the Application manifest to allow **Implicit Grant** and save the manifest.
![./images/manifest.png](./images/manifest.png)

4. Start the Server
`npm start`

5. Access http://localhost:3000

6. Click on Sign In (Redirect/Login flow)

7. Check console for ID Token output

## TODO
- GraphQL Proxied sign in;
- Sign up example;
- Validate Sign out flow;

## References

Mostly https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2

And https://github.com/AzureAD/microsoft-authentication-library-for-js
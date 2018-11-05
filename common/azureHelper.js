import * as Msal from 'msal'

var applicationConfig = {
    clientID: process.env.clientID, //This is your client ID
    graphScopes: ["user.read"],
    graphEndpoint: "https://graph.microsoft.com/v1.0/me"
};

const directory = `https://login.microsoftonline.com/${process.env.tenantID}`

const myMSALObj = new Msal.UserAgentApplication(applicationConfig.clientID, directory, acquireTokenRedirectCallBack,
    {storeAuthStateInCookie: true, cacheLocation: "localStorage"});

// Login popup flow provider
// Returns IdToken
const signIn = () => {
    return myMSALObj.loginPopup(applicationConfig.graphScopes)
}

const signOut = () => {
    myMSALObj.logout()
}

// Sample API call
const acquireTokenPopupAndCallMSGraph = () => {
    //Call acquireTokenSilent (iframe) to obtain a token for Microsoft Graph
    myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
        callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
    }, function (error) {
        console.log(error);
        // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure due to consent or interaction required ONLY
        if (error.indexOf("consent_required") !== -1 || error.indexOf("interaction_required") !== -1 || error.indexOf("login_required") !== -1) {
            myMSALObj.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
                callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
            }, function (error) {
                console.log(error);
            });
        }
    });
}

const callMSGraph = (theUrl, accessToken, callback) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            callback(JSON.parse(this.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
}

const graphAPICallback = (data) => {
    console.log(JSON.stringify(data, null, 2)) 
}

// This function can be removed if you do not need to support IE
const acquireTokenRedirectAndCallMSGraph = () => {
    //Call acquireTokenSilent (iframe) to obtain a token for Microsoft Graph
    myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
      callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
    }, function (error) {
        console.log(error)
        //Call acquireTokenRedirect in case of acquireToken Failure
        if (error.indexOf("consent_required") !== -1 || error.indexOf("interaction_required") !== -1 || error.indexOf("login_required") !== -1) {
            myMSALObj.acquireTokenRedirect(applicationConfig.graphScopes)
        }
    }); 
}

const acquireTokenRedirectCallBack = (errorDesc, token, error, tokenType) => {
    if (tokenType === "access_token") {
        callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback)
    } else {
        console.log("token type is:" + tokenType)
    } 
}

export { signIn, signOut }

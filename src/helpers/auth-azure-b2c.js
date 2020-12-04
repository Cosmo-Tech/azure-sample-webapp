import * as msal from "@azure/msal-browser";
import {
  b2cPolicies,
  msalConfig,
  loginRequest,
} from './auth-azure-b2c-config.js';

let onAuthChangeCallbacks = [];
const msalApp = new msal.PublicClientApplication(msalConfig);
const authData = {
  authenticated: false,
  accountId: undefined,
  username: undefined,
};

function onAuthSuccess() {
  // Call application-defined callbacks (e.g. to update authentication state and
  // trigger app re-render)
  for(var i in onAuthChangeCallbacks) {
    const callback = onAuthChangeCallbacks[i];
    callback(authData);
  }
}

async function acquireTokenSilent() {
  const account = msalApp.getAllAccounts()[0];
  const tokenReq = {
    scopes: ['user.read'],
    account: account,
  };
  return await msalApp.acquireTokenSilent(tokenReq).then(function(tokenRes) {
    // Token acquired
    onAuthSuccess();
    return tokenRes.accessToken;
  }).catch(function (error) {
    if(error.errorMessage === undefined) {
      console.error(error);
    }
    else if(error.errorMessage.indexOf("interaction_required") !== -1) {
      msalApp.acquireTokenPopup(tokenReq).then(function(tokenRes) {
        // Token acquired with interaction
        onAuthSuccess();
        return tokenRes.accessToken;
      }).catch(function(error) {
        // Token retrieval failed
        return undefined;
      });
    }
    return undefined;
  });
}

function selectAccount () {
  const accounts = msalApp.getAllAccounts();
  console.log('debug - all accounts:');
  console.log(msalApp.getAllAccounts());
  if(accounts.length === 0) {
    return;
  }
  // Select the 1st account if more than one is detected
  if(accounts.length > 1) {
    console.warn("Several accounts detected, using the first one by default.");
  }

  authData.authenticated = true;
  authData.accountId = accounts[0].homeAccountId;
  authData.username = accounts[0].name;
  onAuthSuccess();
}

function handleResponse(response) {
  if (response !== null) {
    console.log('debug - sign-in response:');
    console.log(response);
    authData.authenticated = true;
    authData.accountId = response.account.homeAccountId;
    authData.username = response.account.name;
    onAuthSuccess();
  } else {
    selectAccount();
  }
}

function signIn() {
  msalApp.loginPopup(loginRequest)
    .then(handleResponse)
    .catch(error => {
      console.error(error);

      // Error handling
      if (error.errorMessage) {
        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (error.errorMessage.indexOf("AADB2C90118") > -1) {
          msalApp.loginPopup(b2cPolicies.authorities.forgotPassword)
            .then(response => {
              window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
            });
        }
      }
  });
}

function signOut() {
  const logoutRequest = {
    account: msalApp.getAccountByHomeId(authData.accountId)
  };
  msalApp.logout(logoutRequest);
}

function setAuthChangeCallbacks(callbacks) {
  onAuthChangeCallbacks = callbacks;
}

async function isUserSignedIn() {
  // Return true if already authenticated
  if(authData.authenticated) {
    return true;
  }
  // Otherwise, try to acquire a token silently to implement SSO
  console.log('silent log-in');
  const accessToken = await acquireTokenSilent();
  if(accessToken !== undefined) {
    return true;
  }
  return false;
}

function getUserName() {
  if(authData.username !== undefined) {
    return authData.username;
  }
  const account = msalApp.getAllAccounts()[0];
  if(account !== undefined) {
    return account.name;
  }
  return undefined;
}

function getUserId() {
  return authData.accountId;
}

function getUserPicUrl() {
  return undefined;
}


const azureB2C = {
  signIn,
  signOut,
  setAuthChangeCallbacks,
  isUserSignedIn,
  getUserName,
  getUserId,
  getUserPicUrl,
};
export default azureB2C;

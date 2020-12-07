let authData = null

function getBaseUrl () {
  if (window.location.hostname === 'localhost') {
    return 'https://sample.azure.cosmo-platform.com'
  } else {
    return window.location.protocol + '//' +
      window.location.host
  }
}

function signIn () {
  window.location.href = getBaseUrl() + '/.auth/login/aad?post_login_redirect_uri=' + getBaseUrl() + '/digitaltwin'
}

function signOut () {
  window.location.href = getBaseUrl() + '/.auth/logout?post_logout_redirect_uri=' + getBaseUrl()
}

function isAsync () {
  return true
}

function isUserSignedIn (callback) {
  // Return true if already authenticated
  if (authData) {
    callback(authData)
  }
  // Otherwise, try to acquire a token silently to implement SSO
  console.log('silent log-in')
  acquireUserInfo(callback)
}

function acquireUserInfo (callback) {
  fetch(getBaseUrl() + '/.auth/me')
    .then(response => response.json())
    .then(data => {
      authData = data.clientPrincipal
      callback(authData)
    })
    .catch(error => {
      console.error(error)
      callback(null)
    })
}

function getUserName () {
  if (authData) {
    return authData.userDetails
  }
  return undefined
}

function getUserId () {
  if (authData) {
    return authData.userId
  }
  return undefined
}

function getUserPicUrl () {
  return undefined
}

const azureAAD = {
  signIn,
  signOut,
  isUserSignedIn,
  getUserName,
  getUserId,
  getUserPicUrl,
  isAsync
}
export default azureAAD

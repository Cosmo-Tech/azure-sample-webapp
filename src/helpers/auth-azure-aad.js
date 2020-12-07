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

async function isUserSignedIn () {
  // Return true if already authenticated
  if (authData) {
    return true
  }
  // Otherwise, try to acquire a token silently to implement SSO
  console.log('silent log-in')
  authData = await acquireUserInfo()
  if (authData) {
    return true
  }
  return false
}

async function acquireUserInfo () {
  fetch(getBaseUrl() + '/.auth/me')
    .then(response => response.json())
    .then(data => {
      return data.clientPrincipal
    })
    .catch(error => {
      console.error(error)
      return null
    }
    )
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
  getUserPicUrl
}
export default azureAAD

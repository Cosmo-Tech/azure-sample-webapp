// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Auth, AuthDev } from '@cosmotech/core'
import { AuthMSAL, AuthStaticWebApp } from '@cosmotech/azure'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core'

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/auth.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
    marginTop: '2%'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  loginButton: {
    marginTop: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}))

const SignIn = (props) => {
  const { t } = useTranslation()

  const classes = useStyles()

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  })

  useEffect(() => {
    const errors = validate(formState.values, schema)

    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {}
    }))
  }, [formState.values])

  const handleAzureStaticWebAppSignIn = event => {
    event.preventDefault()
    Auth.setProvider(AuthStaticWebApp.name)
    Auth.signIn()
  }

  const handleAzureMSALSignIn = event => {
    event.preventDefault()
    Auth.setProvider(AuthMSAL.name)
    Auth.signIn()
  }

  const handleAuthDevSignIn = event => {
    event.preventDefault()
    Auth.setProvider(AuthDev.name)
    Auth.signIn()
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                  {t('views.signin.title', 'Azure Sample Web Application')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12} >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
            </div>
            <div className={classes.contentBody}>
              <form className={classes.form}>
                <Typography className={classes.title} variant="h2">
                  {t('commoncomponents.button.login.regular.login', 'Sign In')}
                </Typography>
                <Grid className={classes.socialButtons} container spacing={2}>
                  <Grid item>
                    <Button
                      className={classes.loginButton}
                      onClick={handleAzureMSALSignIn}
                      size="large"
                      variant="contained"
                    >
                      {t('commoncomponents.button.login.msal.login', 'Login with Active Directory (MSAL)')}
                    </Button>
                    <Button
                      className={classes.loginButton}
                      onClick={handleAzureStaticWebAppSignIn}
                      size="large"
                      variant="contained"
                    >
                      {t('commoncomponents.button.login.static.webapp.login', 'Login with Active Directory (Static Web App)')}
                    </Button>
                    {
                      window.location.hostname === 'localhost' &&
                        <Button
                          className={classes.loginButton}
                          onClick={handleAuthDevSignIn}
                          size="large"
                          variant="contained"
                          data-cy="log-with-dev-account-button"
                        >
                          {t('commoncomponents.button.login.dev.account.login', 'Login with Dev account')}
                        </Button>
                    }
                  </Grid>
                </Grid>
                <Typography color="textSecondary" variant="body1">
                  {t('commoncomponents.text.contact.get.account', 'Please contact the application administrator to activate your account.')}
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

SignIn.propTypes = {
}

export default withRouter(SignIn)

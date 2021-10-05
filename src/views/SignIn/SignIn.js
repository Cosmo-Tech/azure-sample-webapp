// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Auth, AuthDev } from '@cosmotech/core';
import { AuthMSAL } from '@cosmotech/azure';
import validate from 'validate.js';
import {
  Grid,
  Button,
  Typography,
  Box,
  Select,
  FormControl,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import { SignInButton } from '@cosmotech/ui';
import { i18nUtils } from '../../utils';
import microsoftLogo from '../../assets/microsoft_logo.png';

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
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.signInPage,
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
    backgroundColor: theme.palette.background.signInPage,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${theme.picture.auth})`,
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
    color: theme.palette.text.primary,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.primary
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
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingTop: 120,
    paddingLeft: 100,
    paddingRight: 100,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  contentFooter: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.primary
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  contact: {
    marginLeft: '10px',
    marginTop: '5px',
    color: theme.palette.text.primary
  },
  formControl: {
    fontSize: '11px'
  },
  languageSelect: {
    fontSize: '11px',
    color: theme.palette.text.primary

  },
  copyrightText: {
    marginLeft: '8px',
    color: theme.palette.text.primary
  }
}));

const SignIn = ({ logInAction }) => {
  const classes = useStyles();

  const { t, i18n } = useTranslation();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: !errors,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleSignIn = (event, authProvider) => {
    event.preventDefault();
    Auth.setProvider(authProvider);
    logInAction(authProvider);
  };

  const year = new Date().getFullYear();

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
                <Grid className={classes.socialButtons} container spacing={2} direction="column">
                  <Grid item>
                    <SignInButton
                      logo={microsoftLogo}
                      id={'microsoft'}
                      label={t('genericcomponent.button.login.msal.title', 'Sign in with Microsoft')}
                      onClick={event => handleSignIn(event, AuthMSAL.name)}
                    />
                  </Grid>
                  <Grid item>
                    {
                      window.location.hostname === 'localhost' &&
                      <Button
                          onClick={event => handleSignIn(event, AuthDev.name)}
                          data-cy="sign-in-with-dev-account-button"
                          className={classes.quoteText}
                      >
                        {t('commoncomponents.button.login.dev.account.login', 'Login with Dev account')}
                      </Button>
                    }
                  </Grid>
                </Grid>
                <Grid container spacing={1} className={classes.contact} direction="row">
                  <Grid item>
                    <Typography variant="caption" className={classes.quoteText}>
                      <Box fontWeight="fontWeightLight">
                        {t('commoncomponents.text.contact.get.account', 'Don\'t have an account?')}
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" className={classes.quoteText}>
                      <Box fontWeight="fontWeightBold">
                        {t('commoncomponents.text.link.cosmotech', 'Please contact CosmoTech')}
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </div>
            <div className={classes.contentFooter}>
              <Grid container direction="row" justifyContent="center" alignItems="baseline">
               <Grid item>
                  <FormControl className={classes.formControl}>
                    <Select
                      className={classes.languageSelect}
                      value={i18n.language}
                      onChange={(event) => i18nUtils.changeLanguage(event.target.value, i18n)}
                    >
                      <MenuItem value={'en'}>English</MenuItem>
                      <MenuItem value={'fr'}>Français</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                <Typography variant="caption" component="div" className={classes.copyrightText}>
                  <Trans i18nKey="copyrightMessage" year={year} >
                    &copy; {{ year }} {t('views.common.footer.text.companyname', 'Cosmo Tech')}
                  </Trans>
                </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  logInAction: PropTypes.func.isRequired
};

export default withRouter(SignIn);

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Auth, AuthDev } from '@cosmotech/core';
import { AuthMSAL } from '@cosmotech/azure';
import { Grid, Button, Typography, Box, Select, MenuItem, Paper } from '@material-ui/core';
import { SignInButton } from '@cosmotech/ui';
import { TranslationUtils } from '../../utils';
import { AUTH_STATUS } from '../../state/commons/AuthConstants.js';
import microsoftLogo from '../../assets/microsoft_logo.png';
import useStyles from './style';

const SignIn = ({ logInAction, auth }) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const handleSignIn = (event, authProvider) => {
    event.preventDefault();
    Auth.setProvider(authProvider);
    logInAction(authProvider);
  };

  const year = new Date().getFullYear();
  const accessDeniedError =
    auth.status === AUTH_STATUS.DENIED ? (
      <>
        <Typography className={classes.errorTitle}>{t('views.signin.error.title', 'Authentication failed')}</Typography>
        <Paper className={classes.errorPaper} elevation={0}>
          <Typography className={classes.errorText}>{auth.error}</Typography>
        </Paper>
      </>
    ) : null;
  const infoMessage =
    localStorage.getItem('logoutByTimeout') === 'true' ? (
      <Paper className={classes.infoPaper} elevation={0}>
        <Typography className={classes.infoText}>
          {t('views.signin.info.timeout', 'For security reasons, your sessions has expired, due to inactivity.')}
        </Typography>
      </Paper>
    ) : null;

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                {t('views.signin.title', 'Azure Sample Web Application')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}></div>
            <div className={classes.contentBody}>
              <Typography className={classes.title} variant="h2">
                {t('commoncomponents.button.login.regular.login', 'Sign In')}
              </Typography>
              <Grid className={classes.socialButtons} container spacing={2} direction="column">
                {infoMessage}
                {accessDeniedError}
                <Grid item>
                  <SignInButton
                    logo={microsoftLogo}
                    id={'microsoft'}
                    label={t('genericcomponent.button.login.msal.title', 'Sign in with Microsoft')}
                    onClick={(event) => handleSignIn(event, AuthMSAL.name)}
                  />
                </Grid>
                <Grid item>
                  {window.location.hostname === 'localhost' && (
                    <Button
                      onClick={(event) => handleSignIn(event, AuthDev.name)}
                      data-cy="sign-in-with-dev-account-button"
                      className={classes.quoteText}
                    >
                      {t('commoncomponents.button.login.dev.account.login', 'Login with Dev account')}
                    </Button>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={1} className={classes.contact} direction="row">
                <Grid item>
                  <Typography variant="caption" className={classes.quoteText}>
                    <Box fontWeight="fontWeightLight">
                      {t('commoncomponents.text.contact.get.account', "Don't have an account?")}
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
            </div>
            <div className={classes.contentFooter}>
              <Grid container direction="row" justifyContent="center" alignItems="baseline">
                <Grid item>
                  <Select
                    className={classes.languageSelect}
                    value={i18n.language}
                    onChange={(event) => TranslationUtils.changeLanguage(event.target.value, i18n)}
                  >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'fr'}>Français</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <Typography variant="caption" component="div" className={classes.copyrightText}>
                    <Trans i18nKey="copyrightMessage" year={year}>
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
  logInAction: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default withRouter(SignIn);

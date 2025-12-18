// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { Grid, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthMSAL } from '@cosmotech/azure';
import { AuthDev, AuthKeycloakRedirect } from '@cosmotech/core';
import { SignInButton } from '@cosmotech/ui';
import microsoftLogo from '../../assets/microsoft_logo.png';
import ConfigService from '../../services/ConfigService';
import {
  SHOW_AZURE_AUTH_PROVIDER,
  SHOW_DEV_AUTH_PROVIDER,
  SHOW_KEYCLOAK_AUTH_PROVIDER,
} from '../../services/config/auth';
import { AUTH_STATUS } from '../../state/auth/constants.js';
import { TranslationUtils } from '../../utils';

const PREFIX = 'SignIn';

const classes = {
  root: `${PREFIX}-root`,
  errorPaper: `${PREFIX}-errorPaper`,
  infoPaper: `${PREFIX}-infoPaper`,
  quoteContainer: `${PREFIX}-quoteContainer`,
  quote: `${PREFIX}-quote`,
  content: `${PREFIX}-content`,
  contentHeader: `${PREFIX}-contentHeader`,
  contentBody: `${PREFIX}-contentBody`,
};

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.login.main,
  height: '100%',

  [`&.${classes.errorPaper}`]: {
    background: theme.palette.mode === 'dark' ? '#93000a' : '#ffdad6',
    border: theme.palette.mode === 'dark' ? 'none' : 'solid 1px #410002',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: 10,
    maxWidth: '800px',
    maxHeight: '150px',
  },

  [`& .${classes.infoPaper}`]: {
    background: theme.palette.mode === 'dark' ? '#52405f' : '#f2daff',
    border: theme.palette.mode === 'dark' ? 'none' : 'solid 1px #251432',
    borderRadius: '12px',
    padding: '16px',
    maxWidth: '800px',
    maxHeight: '150px',
  },

  [`& .${classes.quoteContainer}`]: {
    [theme.breakpoints.down('xl')]: {
      display: 'none',
    },
  },

  [`& .${classes.quote}`]: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${ConfigService.getParameterValue('PUBLIC_URL') ?? ''}${theme.picture.auth})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  },

  [`& .${classes.contentHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },

  [`& .${classes.contentBody}`]: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xl')]: {
      justifyContent: 'center',
    },
    paddingTop: 120,
    paddingLeft: 100,
    paddingRight: 100,
    flexBasis: 700,
    [theme.breakpoints.down('xl')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}));

const NO_PROVIDERS = !SHOW_AZURE_AUTH_PROVIDER && !SHOW_KEYCLOAK_AUTH_PROVIDER;

const SignIn = ({ logInAction, auth }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const providedUrlBeforeSignIn = location?.state?.from;
  if (providedUrlBeforeSignIn) sessionStorage.setItem('providedUrlBeforeSignIn', providedUrlBeforeSignIn);
  const handleSignIn = (event, authProvider) => {
    event.preventDefault();
    logInAction(authProvider);
  };
  const year = new Date().getFullYear();
  const accessDeniedError =
    auth.status === AUTH_STATUS.DENIED ? (
      <>
        <Typography
          sx={{
            marginTop: 2,
            marginBottom: 2,
            fontWeight: 'bold',
            fontSize: '16px',
            color: (theme) => (theme.palette.mode === 'dark' ? '#ffdad6' : '#410002'),
          }}
        >
          {t('views.signin.error.title', 'Authentication failed')}
        </Typography>
        <div className={classes.errorPaper}>
          <Typography
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? '#ffdad6' : '#410002'),
              fontSize: '14px',
              overflow: 'auto',
              whiteSpace: 'pre-line',
              overflowWrap: 'break-word',
            }}
          >
            {auth.error}
          </Typography>
        </div>
      </>
    ) : null;

  let infoMessageText;
  if (NO_PROVIDERS)
    infoMessageText = t(
      'views.signin.info.noProviders',
      'No authentication provider detected. Please check the configuration of the web application server, or ' +
        'contact your administrator.'
    );
  else if (localStorage.getItem('logoutByTimeout') === 'true')
    infoMessageText = t(
      'views.signin.info.timeout',
      'For security reasons, your session has expired, due to inactivity.'
    );

  const infoMessage = infoMessageText ? (
    <div className={classes.infoPaper}>
      <Typography
        sx={{
          color: (theme) => (theme.palette.mode === 'dark' ? '#f2daff' : '#251432'),
          fontSize: '14px',
          overflow: 'auto',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}
      >
        {t('views.signin.info.timeout', 'For security reasons, your session has expired, due to inactivity.')}
      </Typography>
    </div>
  ) : null;

  return (
    <Root>
      <Grid container sx={{ height: '100%' }}>
        <Grid className={classes.quoteContainer} size={{ lg: 5 }}>
          <div className={classes.quote}>
            <div style={{ textAlign: 'center', flexBasis: '600px', marginTop: '2%' }}>
              <Typography sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 300 }} variant="h4">
                {t('views.signin.title', 'Azure Sample Web Application')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} size={{ lg: 7, xs: 12 }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className={classes.contentHeader} />
            <div className={classes.contentBody}>
              <Typography sx={{ mt: 3, color: (theme) => theme.palette.text.primary }} variant="h5">
                {t('commoncomponents.button.login.regular.login', 'Sign In')}
              </Typography>
              <Grid sx={{ mt: 3 }} container spacing={2} direction="column">
                {infoMessage}
                {accessDeniedError}
                {SHOW_AZURE_AUTH_PROVIDER && (
                  <Grid>
                    <SignInButton
                      autoFocus
                      logo={microsoftLogo}
                      id={'microsoft'}
                      label={t('genericcomponent.button.login.msal.title', 'Sign in with Microsoft')}
                      onClick={(event) => handleSignIn(event, AuthMSAL.name)}
                    />
                  </Grid>
                )}
                {SHOW_KEYCLOAK_AUTH_PROVIDER && (
                  <Grid>
                    <SignInButton
                      autoFocus
                      logo="favicon.ico"
                      id="keycloak-redirect"
                      label={t('commoncomponents.button.login.keycloak', 'Sign in with Cosmo Tech')}
                      onClick={(event) => handleSignIn(event, AuthKeycloakRedirect.name)}
                    />
                  </Grid>
                )}
                {SHOW_DEV_AUTH_PROVIDER && (
                  <Grid>
                    <Button
                      onClick={(event) => handleSignIn(event, AuthDev.name)}
                      data-cy="sign-in-with-dev-account-button"
                      sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 300 }}
                    >
                      {t('commoncomponents.button.login.dev.account.login', 'Login with Dev account')}
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                spacing={1}
                sx={{ marginLeft: '10px', marginTop: '5px', color: (theme) => theme.palette.text.primary }}
                direction="row"
              >
                <Grid>
                  <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 300 }}>
                    <Box sx={{ fontWeight: 'fontWeightLight' }}>
                      {t('commoncomponents.text.contact.get.account', "Don't have an account?")}
                    </Box>
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.primary, fontWeight: 300 }}>
                    <Box sx={{ fontWeight: 'fontWeightBold' }}>
                      {t('commoncomponents.text.link.cosmotech', 'Please contact CosmoTech')}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Grid container direction="row" sx={{ justifyContent: 'center', alignItems: 'baseline' }}>
                <Grid>
                  <Select
                    variant="standard"
                    sx={{ fontSize: '11px', color: (theme) => theme.palette.text.primary }}
                    value={i18n.language}
                    onChange={(event) => TranslationUtils.changeLanguage(event.target.value, i18n)}
                  >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'fr'}>Français</MenuItem>
                  </Select>
                </Grid>
                <Grid>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ marginLeft: '8px', color: (theme) => theme.palette.text.primary }}
                  >
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
    </Root>
  );
};

SignIn.propTypes = {
  logInAction: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default SignIn;

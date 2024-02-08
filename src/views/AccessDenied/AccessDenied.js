// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import Countdown from 'react-countdown';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Button, Typography, Select, FormControl, MenuItem, Paper } from '@mui/material';
import { Auth } from '@cosmotech/core';
import { TranslationUtils } from '../../utils';
import useStyles from './style';

const buildErrorMessage = (error) => {
  let errorMessage = error.status ? `${error.status} ` : '';
  if (error.title) {
    errorMessage += error.title;
  }
  errorMessage += `\n${error.detail}`;
  return errorMessage;
};

const AccessDenied = ({ application }) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  const DELAY_TO_TIMEOUT = 30;

  const timeoutRenderer = ({ seconds }) => {
    return (
      <Typography className={classes.timeout}>
        {t('views.accessdenied.signouttimeout', 'You will be automatically signed out in {{seconds}} seconds...', {
          seconds,
        })}
      </Typography>
    );
  };

  const errorMessage = application.error
    ? buildErrorMessage(application.error)
    : t(
        'views.accessdenied.errormessage',
        `Either the resources do not exist or you don't have permission to access them.`
      );

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h4">
                {t('views.signin.title', 'Azure Sample Web Application')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12} container>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <Typography className={classes.title}>{t('views.accessdenied.title', 'Access denied')}</Typography>
              <Paper className={classes.errorPaper} elevation={0}>
                <Typography data-cy="access-denied-error-message" className={classes.errorText}>
                  {errorMessage}
                </Typography>
              </Paper>
              <div>
                <Countdown
                  date={Date.now() + DELAY_TO_TIMEOUT * 1000}
                  renderer={timeoutRenderer}
                  onComplete={() => Auth.signOut()}
                />
              </div>
              <Button variant="contained" color="primary" onClick={() => Auth.signOut()}>
                {t('genericcomponent.userinfo.button.logout', 'Sign Out')}
              </Button>
            </div>
            <Grid container direction="row" justifyContent="center" alignItems="baseline">
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    variant="standard"
                    className={classes.languageSelect}
                    value={i18n.language}
                    onChange={(event) => TranslationUtils.changeLanguage(event.target.value, i18n)}
                  >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'fr'}>Français</MenuItem>
                  </Select>
                </FormControl>
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
        </Grid>
      </Grid>
    </div>
  );
};

AccessDenied.propTypes = {
  application: PropTypes.object.isRequired,
};

export default AccessDenied;

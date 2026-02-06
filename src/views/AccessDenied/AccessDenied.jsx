// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import Countdown from 'react-countdown';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Button, Typography, Select, FormControl, MenuItem, Paper, styled } from '@mui/material';
import { Auth } from '@cosmotech/core';
import { TranslationUtils } from '../../utils';

const buildErrorMessage = (error) => {
  let errorMessage = error.status ? `${error.status} ` : '';
  if (error.title) {
    errorMessage += error.title;
  }
  errorMessage += `\n${error.detail}`;
  return errorMessage;
};

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.login.main,
  height: '100%',
}));

const TitleDiv = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.login.main,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${theme.picture.auth})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
}));

const AccessDenied = ({ application }) => {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  const DELAY_TO_TIMEOUT = 30;

  const timeoutRenderer = ({ seconds }) => {
    return (
      <Typography sx={{ marginBottom: 8, marginLeft: 8 }}>
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
    <Root>
      <Grid sx={{ height: '100%' }} container>
        <Grid
          sx={(theme) => ({
            [theme.breakpoints.down('xl')]: { display: 'none' },
          })}
          size={{ lg: 5 }}
        >
          <TitleDiv>
            <div style={{ textAlign: 'center', flexBasis: '600px', marginTop: '2%' }}>
              <Typography variant="h4">{t('views.signin.title', 'Cosmo Tech Web Application')}</Typography>
            </div>
          </TitleDiv>
        </Grid>
        <Grid
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          container
          size={{ lg: 7, xs: 12 }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '200px' }}>
              <Typography
                sx={{
                  marginTop: (theme) => theme.spacing(5),
                  marginBottom: (theme) => theme.spacing(5),
                  fontWeight: 'bold',
                  fontSize: '32px',
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {t('views.accessdenied.title', 'Access denied')}
              </Typography>
              <Paper
                sx={{
                  background: (theme) => theme.palette.error.main,
                  paddingBottom: 8,
                  paddingTop: 8,
                  paddingLeft: 6,
                  paddingRight: 6,
                  marginBottom: 10,
                  width: 'fit-content',
                }}
                elevation={0}
              >
                <Typography
                  data-cy="access-denied-error-message"
                  sx={{
                    color: (theme) => theme.palette.error.contrastText,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    maxWidth: '650px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    paddingRight: 7,
                    paddingLeft: 7,
                    whiteSpace: 'pre-line',
                    overflowWrap: 'break-word',
                  }}
                >
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
            <Grid
              container
              direction="row"
              sx={{
                justifyContent: 'center',
                alignItems: 'baseline',
              }}
            >
              <Grid>
                <FormControl sx={{ fontSize: '11px' }}>
                  <Select
                    variant="standard"
                    sx={{ fontSize: '11px', color: (theme) => theme.palette.text.primary }}
                    value={i18n.language}
                    onChange={(event) => TranslationUtils.changeLanguage(event.target.value, i18n)}
                  >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'fr'}>Français</MenuItem>
                  </Select>
                </FormControl>
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
        </Grid>
      </Grid>
    </Root>
  );
};

AccessDenied.propTypes = {
  application: PropTypes.object.isRequired,
};

export default AccessDenied;

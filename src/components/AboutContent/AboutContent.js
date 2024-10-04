// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid2 as Grid, ButtonBase, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ConfigService from '../../services/ConfigService';
import { useWorkspaceData } from '../../state/workspaces/hooks';
import { pictureLight, pictureDark } from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
  },
  picture: {
    marginRight: '16px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '24px',
  },
  version: {
    marginTop: '16px',
    fontWeight: 'bold',
  },
  content: {
    marginTop: '2px',
    marginBottom: '16px',
  },
}));

export const AboutContent = ({ isDarkTheme = false }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const logo = `${process.env?.PUBLIC_URL ?? ''}${isDarkTheme ? pictureDark.darkLogo : pictureLight.lightLogo}`;

  const currentWorkspaceData = useWorkspaceData();
  const organizationUrl =
    currentWorkspaceData?.webApp?.options?.menu?.organizationUrl ?? ConfigService.getParameterValue('ORGANIZATION_URL');
  const supportUrl =
    currentWorkspaceData?.webApp?.options?.menu?.supportUrl ?? ConfigService.getParameterValue('SUPPORT_URL');

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid className={classes.picture}>
        <ButtonBase>
          <img height="75" alt="Cosmo Tech" src={logo} />
        </ButtonBase>
      </Grid>
      <Grid container size="grow">
        <Grid container direction="column">
          <Grid className={classes.title}>{t('genericcomponent.dialog.about.title')}</Grid>
          <Grid className={classes.version}>{ConfigService.getParameterValue('APP_VERSION')}</Grid>
          <Grid className={classes.content}>{t('genericcomponent.dialog.about.content')}</Grid>
          <Grid>
            <Link href={supportUrl} target="_blank" rel="noreferrer">
              {supportUrl}
            </Link>
          </Grid>
          <Grid>
            <Link href={organizationUrl} target="_blank" rel="noreferrer">
              {organizationUrl}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

AboutContent.propTypes = {
  isDarkTheme: PropTypes.bool,
};

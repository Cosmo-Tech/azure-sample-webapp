// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, ButtonBase, Link } from '@mui/material';
import ConfigService from '../../services/ConfigService';
import { useWorkspaceData } from '../../state/workspaces/hooks';
import { pictureLight, pictureDark } from '../../theme';

export const AboutContent = ({ isDarkTheme = false }) => {
  const { t } = useTranslation();
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  const logo = `${publicUrl}${isDarkTheme ? pictureDark.darkLogo : pictureLight.lightLogo}`;

  const currentWorkspaceData = useWorkspaceData();
  const organizationUrl =
    currentWorkspaceData?.webApp?.options?.menu?.organizationUrl ?? ConfigService.getParameterValue('ORGANIZATION_URL');
  const supportUrl =
    currentWorkspaceData?.webApp?.options?.menu?.supportUrl ?? ConfigService.getParameterValue('SUPPORT_URL');

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid sx={{ marginRight: '16px' }}>
        <ButtonBase>
          <img height="75" alt="Cosmo Tech" src={logo} />
        </ButtonBase>
      </Grid>
      <Grid container size="grow">
        <Grid container direction="column">
          <Grid sx={{ fontWeight: 'bold', fontSize: '24px' }}>{t('genericcomponent.dialog.about.title')}</Grid>
          <Grid sx={{ marginTop: '16px', fontWeight: 'bold' }}>{ConfigService.getParameterValue('APP_VERSION')}</Grid>
          <Grid sx={{ marginTop: '2px', marginBottom: '16px' }}>{t('genericcomponent.dialog.about.content')}</Grid>
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

// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ConfigService from '../../../services/ConfigService';
import { useIsDarkTheme } from '../../../state/hooks/ApplicationHooks';
import { pictureDark, pictureLight } from '../../../theme';

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: '8px',
    marginRight: '8px',
  },
}));
export const Logo = () => {
  const isDarkThemeUsed = useIsDarkTheme();
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  const logoPath = useMemo(
    () => `${publicUrl}${isDarkThemeUsed ? pictureDark.darkLogo : pictureLight.lightLogo}`,
    [isDarkThemeUsed, publicUrl]
  );
  const classes = useStyles();
  return <img alt="Cosmo Tech" height="28px" src={logoPath} className={classes.logo} />;
};

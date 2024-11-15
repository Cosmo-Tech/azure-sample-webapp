// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useIsDarkTheme } from '../../../state/app/hooks';
import { pictureDark, pictureLight } from '../../../theme';

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: '8px',
    marginRight: '8px',
  },
}));
export const Logo = () => {
  const isDarkThemeUsed = useIsDarkTheme();
  const logoPath = useMemo(
    () => `${process.env?.PUBLIC_URL ?? ''}${isDarkThemeUsed ? pictureDark.darkLogo : pictureLight.lightLogo}`,
    [isDarkThemeUsed]
  );
  const classes = useStyles();
  return <img alt="Cosmo Tech" height="28px" src={logoPath} className={classes.logo} />;
};

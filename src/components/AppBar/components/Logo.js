// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { pictureDark, pictureLight } from '../../../theme';
import { makeStyles } from '@material-ui/core';
import { useIsDarkTheme } from '../../../state/hooks/ApplicationHooks';

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: '8px',
    marginRight: '8px',
  },
}));
export const Logo = () => {
  const isDarkThemeUsed = useIsDarkTheme();
  const classes = useStyles();
  return (
    <img
      alt="Cosmo Tech"
      height="28px"
      // AppBar always has a dark background, use the theme dark logo
      src={isDarkThemeUsed ? pictureDark.darkLogo : pictureLight.darkLogo}
      className={classes.logo}
    />
  );
};

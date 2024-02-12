// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
  const classes = useStyles();
  return (
    <img
      alt="Cosmo Tech"
      height="28px"
      src={isDarkThemeUsed ? pictureDark.darkLogo : pictureLight.lightLogo}
      className={classes.logo}
    />
  );
};

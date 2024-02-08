// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brightness2 as Brightness2Icon, WbSunny as WbSunnyIcon } from '@mui/icons-material';
import { Fade, IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSetApplicationTheme } from '../../../state/hooks/ApplicationHooks';

const useStyles = makeStyles((theme) => ({
  switchToDarkTheme: {
    color: theme.palette.appbar.contrastText,
  },
}));
export const ThemeSwitch = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [isDarkThemeUsed, setIsDarkThemeUsed] = useState(localStorage.getItem('darkThemeUsed') === 'true');

  useEffect(() => {
    localStorage.setItem('darkThemeUsed', isDarkThemeUsed);
  }, [isDarkThemeUsed]);
  const setApplicationTheme = useSetApplicationTheme();
  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={
        isDarkThemeUsed
          ? t('genericcomponent.switchtheme.light', 'Switch to light')
          : t('genericcomponent.switchtheme.dark', 'Switch to dark')
      }
    >
      <IconButton
        className={classes.switchToDarkTheme}
        onClick={() => {
          setIsDarkThemeUsed(!isDarkThemeUsed);
          setApplicationTheme(!isDarkThemeUsed);
        }}
        size="large"
      >
        {isDarkThemeUsed ? <WbSunnyIcon /> : <Brightness2Icon />}
      </IconButton>
    </Tooltip>
  );
};

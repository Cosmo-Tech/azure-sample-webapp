// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Brightness2 as Brightness2Icon, WbSunny as WbSunnyIcon } from '@mui/icons-material';
import { Fade, IconButton, Tooltip } from '@mui/material';
import { useApplicationTheme } from '../../../state/app/hooks';

export const ThemeSwitch = () => {
  const { t } = useTranslation();
  const { isDarkTheme, toggleTheme } = useApplicationTheme();

  const { tooltipText, icon } = useMemo(
    () => ({
      tooltipText: isDarkTheme
        ? t('genericcomponent.switchtheme.light', 'Switch to light')
        : t('genericcomponent.switchtheme.dark', 'Switch to dark'),
      icon: isDarkTheme ? <WbSunnyIcon /> : <Brightness2Icon />,
    }),
    [t, isDarkTheme]
  );

  return (
    <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={tooltipText}>
      <IconButton sx={{ color: (theme) => theme.palette.appbar.contrastText }} onClick={toggleTheme} size="large">
        {icon}
      </IconButton>
    </Tooltip>
  );
};

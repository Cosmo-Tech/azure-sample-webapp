// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Fade, Tooltip } from '@mui/material';
import { useApplicationTheme } from '../../../state/app/hooks';
import { Icon } from '../../Icon';

export const ThemeSwitch = () => {
  const { t } = useTranslation();
  const { isDarkTheme, toggleTheme } = useApplicationTheme();

  const { tooltipText } = useMemo(
    () => ({
      tooltipText: isDarkTheme
        ? t('genericcomponent.switchtheme.light', 'Switch to light')
        : t('genericcomponent.switchtheme.dark', 'Switch to dark'),
    }),
    [t, isDarkTheme]
  );

  return (
    <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={tooltipText}>
      <Button
        sx={{ ml: 1 }}
        variant="outlined"
        state="enabled"
        startIcon={isDarkTheme ? <Icon name="Moon" /> : <Icon name="Sun" />}
        onClick={toggleTheme}
      />
    </Tooltip>
  );
};
